import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Truck, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

interface PaymentModalProps {
  amount: number;
  orderId: string;
  onSuccess: (transaction: any) => void;
  onClose: () => void;
  userDetails?: { name: string; email: string; phone: string };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, orderId, onSuccess, onClose, userDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { processCODPayment, isProcessing: isPaymentProcessing } = usePayment();

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const backendUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';
      // 1. Create order on backend
      const createRes = await fetch(`${backendUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId }),
      });
      if (!createRes.ok) throw new Error('Failed to create payment order');
      const razorpayOrder = await createRes.json();

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error('Razorpay key missing');

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Ignis Secura',
        description: `Pre-order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
  const verifyRes = await fetch(`${backendUrl}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpayOrderId: response.razorpay_order_id,  // ✅ from Razorpay response
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
    }),
  });
          const verification = await verifyRes.json();
          if (verification.success) {
            const transaction = {
              id: `TXN_${Date.now()}`,
              orderId,
              amount,
              method: 'razorpay',
              status: 'completed',
              timestamp: new Date().toISOString(),
              transactionId: response.razorpay_payment_id,
            };
            onSuccess(transaction);
          } else {
            throw new Error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => setError('Payment cancelled') },
        prefill: {
          name: userDetails?.name || '',
          email: userDetails?.email || '',
          contact: userDetails?.phone || '',
        },
        theme: { color: '#ea580c' },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setIsProcessing(true);
    try {
      const transaction = await processCODPayment(orderId, amount);
      onSuccess(transaction);
    } catch (err: any) {
      setError('Failed to place COD order.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 px-6 py-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white text-center">Complete Payment</h2>
          <p className="text-gray-400 text-center mt-1">Amount: ₹{amount.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setPaymentMethod('razorpay')}
              className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                paymentMethod === 'razorpay' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10'
              }`}
            >
              <Smartphone className={`w-6 h-6 ${paymentMethod === 'razorpay' ? 'text-orange-500' : 'text-gray-400'}`} />
              <div className="flex-1 text-left">
                <p className={`font-semibold ${paymentMethod === 'razorpay' ? 'text-orange-500' : 'text-white'}`}>
                  Razorpay
                </p>
                <p className="text-sm text-gray-500">UPI, Cards, Netbanking, Wallets</p>
              </div>
              {paymentMethod === 'razorpay' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
            </button>

            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                paymentMethod === 'cod' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10'
              }`}
            >
              <Truck className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-orange-500' : 'text-gray-400'}`} />
              <div className="flex-1 text-left">
                <p className={`font-semibold ${paymentMethod === 'cod' ? 'text-orange-500' : 'text-white'}`}>
                  Cash on Delivery
                </p>
                <p className="text-sm text-gray-500">Pay when you receive</p>
              </div>
              {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isProcessing || isPaymentProcessing}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {isProcessing || isPaymentProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₹{amount.toLocaleString('en-IN')}
              </>
            )}
          </button>

          <button onClick={onClose} className="w-full mt-3 text-gray-500 hover:text-gray-400 py-2 text-sm">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;