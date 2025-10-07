// // controllers/paymentController.js
// import dotenv from 'dotenv';
// dotenv.config();

// import Stripe from 'stripe';
// import Order from '../models/orderModel.js';
// import Cart from '../models/cartModel.js';  // make sure the filename matches your Cart model

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// export const createCheckoutSession = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const cart = await Cart.findOne({ userId }).populate("products.productId");

//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const line_items = cart.products.map(item => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.productId.title,
//         },
//         unit_amount: item.productId.price * 100, // Stripe expects amount in paise
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/checkout`,
//       metadata: {
//         userId: userId.toString(),
//       },
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create checkout session" });
//   }
// };




// // 1️⃣ Create PaymentIntent
// export const createPaymentIntent = async (req, res) => {
//   try {
//     const userId = req.user._id.toString(); 
//     const cart = await Cart.findOne({ userId }).populate("products.productId");

//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const total = cart.products.reduce(
//       (sum, item) => sum + item.productId.price * item.quantity,
//       0
//     );

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(total * 100), // Stripe expects amount in paise
//       currency: "inr",
//       metadata: { userId },
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//       total,
//     });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ message: "Payment failed", error: error.message });
//   }
// };

// // 2️⃣ Confirm Order after successful payment
// export const confirmOrder = async (req, res) => {
//   try {
//     const { paymentIntentId } = req.body;
//     const userId = req.user._id;

//     // Verify paymentIntent status
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     if (paymentIntent.status !== "succeeded") {
//       return res.status(400).json({ message: "Payment not successful" });
//     }

//     const cart = await Cart.findOne({ userId }).populate("products.productId");
//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const order = new Order({
//       userId,
//       products: cart.products.map(i => ({
//         productId: i.productId._id,
//         quantity: i.quantity,
//       })),
//       totalAmount: cart.products.reduce(
//         (sum, item) => sum + item.productId.price * item.quantity,
//         0
//       ),
//       status: "paid",
//       createdAt: Date.now(),
//     });

//     await order.save();

//     // Clear cart
//     cart.products = [];
//     await cart.save();

//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Order confirmation failed", error: error.message });
//   }
// };




// controllers/paymentController.js
import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔹 Create Stripe Checkout Session
// 🔹 Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("req.user._id type:", typeof req.user.id);
    console.log("User in session:", req.user);
    // fetch cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    console.log("Fetched cart:", cart);

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // filter out invalid products (just in case)
    const validProducts = cart.products.filter(p => p.productId != null);

    if (validProducts.length === 0) {
      return res.status(400).json({ message: "Cart has no valid products" });
    }

    // Prepare Stripe line items
    const line_items = validProducts.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.productId.title },
        unit_amount: item.productId.price * 100, // Stripe expects amount in paise
      },
      quantity: item.quantity,
    }));

    let clientUrl = process.env.CLIENT_URL;
        if (!/^https?:\/\//.test(clientUrl)) {
        clientUrl = "http://" + clientUrl;
        }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        userId: userId.toString(),
      },
    });

    console.log("Stripe session created:", session.id);

    // Send session URL to frontend
    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// 🔹 Confirm Order via Stripe Webhook or Client
export const confirmOrder = async (req, res) => {
  try {
    const { sessionId } = req.body; // Stripe Checkout Session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const userId = session.metadata.userId;

    // Check if order already exists for this session
    const existingOrder = await Order.findOne({ "metadata.sessionId": sessionId });
    if (existingOrder) {
      return res.status(200).json({ message: "succeeded", order: existingOrder });
    }


    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order
    const order = new Order({
      userId,
      products: cart.products.map(i => ({
        productId: i.productId._id,
        quantity: i.quantity,
      })),
      totalAmount: cart.products.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      ),
      status: "paid",
      metadata: { sessionId }, // save sessionId for idempotency
      createdAt: Date.now(),
    });

    await order.save();

    // Clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "succeeded", order });
  } catch (error) {
    console.error("Order confirmation error:", error);
    res.status(500).json({ message: "Order confirmation failed", error: error.message });
  }
};
