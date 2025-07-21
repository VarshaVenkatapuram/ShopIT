import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

import APIFilter from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import {delete_file, upload_file} from "../utils/cloudinary.js";

export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  let apiFilters = new APIFilter(Product, req.query);
  apiFilters.search().filters();

  let products = await apiFilters.query;
  const filteredProducts = products.length;
  apiFilters.pagination(resPerPage);

  products = await apiFilters.query.clone();

  res.status(200).json({
    resPerPage,
    filteredProducts,
    products,
  });
});

//create new product  => /api/admin/products
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  console.log("Received data:", product);
  res.status(200).json({
    product,
  });
});

//getSingleProduct  => /api/products/:id
export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id.trim();

  const product = await Product.findById(id).populate("reviews.user");

  if (!product) {
    return next(new ErrorHandler("Product Not found", 400));
  }

  res.status(200).json({ product });
});


//Get products -ADMIN   => /api/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products=await Product.find();

  res.status(200).json({ products, });
});

//update  => /api/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 400));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ product });
});

//update product images => /api/products/:id

export const updateProductImages = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 400));
  }

  
  if (!product.user) {
    return next(new ErrorHandler("Product is missing required field: user", 400));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorHandler("No images provided", 400));
  }

  const uploader = async (file) => {
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return await upload_file(base64, "shopit/products");
  };

  const urls = await Promise.all(req.files.map(uploader));

  product.images.push(...urls);
  await product.save();

  res.status(200).json({ product });
});

//delete product images => /api/products/:id/delete_image

export const deleteProductImages = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 400));
  }

  const isDeleted =await delete_file(req.body.imgId);

  if(isDeleted)
  {
    product.images=product?.images?.filter((img)=>img.public_id!==req.body.imgId)
    await product.save();
  }
  

  res.status(200).json({ product });
});



//delete product => /api/product/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 400));
  }

  //Deleting image associated with product
  for(let i=0;i<product?.images?.length;i++){
    await delete_file(product?.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

//can user review  => /api/can_review
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({ canReview: true });
});

//get product review => /api/reviews
export const getProductReviews=catchAsyncErrors(async(req,res,next)=>{
  const product =await Product.findById(req.params.id);

  if(!product)
  {
    return next(new ErrorHandler("Product not found",404));

   
  }
   res.status(200).json({ reviews: product.reviews });
}
)
