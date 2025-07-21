import catchAysncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//Create stripe checkout session => /api/patment/checkout_session
export const stripeCheckoutSession = catchAysncErrors(
  async (req, res, next) => {
    const body = req?.body;

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1RlYBGRvmQvd1QbJoM3JHq9g"],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    const shipping_rate =
      body?.itemsPrice >= 200
        ? "shr_1RlY5ORvmQvd1QbJuiHHGGTX"
        : "shr_1RlY5vRvmQvd1QbJW6tQc5cy";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id.toString(),
      mode: "payment",
      metadata:{...shippingInfo,itemPrice:body?.itemsPrice},
      shipping_options: [
        {
          shipping_rate,
        },
      ],
      line_items,
    });
    console.log("=====");
    console.log(session);

    res.status(200).json({
      url: session.url,
    });
  }
);
