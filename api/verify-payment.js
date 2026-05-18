import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { razorpayOrderId, paymentId, signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + paymentId)
    .digest('hex');

  res.json({ success: generatedSignature === signature });
}