import 'dotenv/config';  // <-- must be first
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Razorpay after env variables are loaded
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
app.post('/api/verify-payment', (req, res) => {
  const { razorpayOrderId, paymentId, signature } = req.body;  // ✅ rename field
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + paymentId)  // ✅ use razorpay's order id
    .digest('hex');
  res.json({ success: generatedSignature === signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));