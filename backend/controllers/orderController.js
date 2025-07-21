import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//Create new Order => /api/orders/new

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

//Get order Details => /api/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id.trim();
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

//Get current user orders => /api/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

//Get all orders - ADMIN => /api/admin/orders

export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orderslength: `${orders.length}`,
    orders,
  });
});

//Update order - ADMIN =>/api/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id.trim();
  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("No order found with this ID ", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already Delivered this order", 404));
  }

  //update Product stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product.toString());
    if (!product) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Delete order =>/api/admin/orders/:id
export const deleteOrder=catchAsyncErrors(async(req,res,next)=>{
    const id = req.params.id.trim();
    const order = await Order.findById(id);

    if (!order) {
    return next(new ErrorHandler("No order found with this ID ", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });

});

//Create/update Product review => /api/reviews
export const createProductReview=catchAsyncErrors(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;

    const review={
        user:req?.user?._id,
        rating:Number(rating),
        comment,
    };

    const product=await Product.findById(productId);

    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }

    const isReviewed=product?.reviews?.find(
        (r)=> r.user.toString()===req?.user?._id.toString()
    );

    if (isReviewed) {
  product.reviews.forEach((review) => {
    if (review?.user?.toString() === req?.user?._id.toString()) {
      review.comment = comment;
      review.rating = rating;
    }
  });
  product.markModified("reviews"); 
}

    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }

    product.ratings=product.reviews.reduce((acc,item)=>
        item.rating+acc,0
    )/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
  success: true,
  reviews: product.reviews,
  ratings: product.ratings,
  numOfReviews: product.numOfReviews,
});
});

//Get product reviews => /api/reviews
export const getProductReviews=catchAsyncErrors(async (req,res,next)=>{
    const product=await  Product.findById(req.query.id);

    if(!product)
    {
       return next(new ErrorHandler("Product not found",404)); 
    }

    res.status(200).json({
        reviews:product.reviews,
});

})

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrder: { $sum: 1 },
      },
    },
  ]);

  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrder;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  const datesBetween = getDatesBetween(startDate, endDate);

  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return {
    chartData: finalSalesData,
    totalSales,
    totalNumOrders,
  };
}





export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  const { chartData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

  res.status(200).json({
    success: true,
    sales: chartData,
    totalSales,
    totalNumOrders,
  });
});



