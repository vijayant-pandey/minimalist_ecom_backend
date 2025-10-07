import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.products.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = await Promise.all(cart.products.map(async item => {
      const product = await import("../models/productModel.js").then(m => m.default.findById(item.productId));
      return product.price * item.quantity;
    })).then(values => values.reduce((a,b) => a+b, 0));

    const order = await Order.create({ userId: req.user.id, products: cart.products, totalAmount });
    await Cart.findOneAndDelete({ userId: req.user.id }); // empty cart after order
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
