// src/api/createOrder.ts
import { Request, Response } from 'express';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};