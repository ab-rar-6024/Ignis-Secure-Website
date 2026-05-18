import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { usePayment } from './context/PaymentContext';
import { motion, AnimatePresence } from 'motion/react';
import PaymentModal from './components/PaymentModal';
import gasDeviceImage from '../assets/gas.png';
import { 
  X, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Flame,
  Smartphone,
  Zap,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  LogIn
} from 'lucide-react';

interface PreOrderPageProps {
  onClose: () => void;
  onAuthClick?: () => void;
}

const PreOrderPage: React.FC<PreOrderPageProps> = ({ onClose, onAuthClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  // Price in INR
  const price = 3000; // ₹10,999
  const totalPrice = (price * quantity).toFixed(0);
  
  const { isAuthenticated, user, placeOrder } = useAuth();
  const { processCODPayment } = usePayment();

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      setShowCheckout(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Validate phone number
    if (!formData.phone || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate all required fields
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      alert('Please fill in all shipping details');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const order = await placeOrder({
        quantity: quantity,
        totalPrice: parseFloat(totalPrice),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        }
      });
      
      setCurrentOrderId(order.id);
      setOrderData({
        quantity,
        totalPrice: parseFloat(totalPrice),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        }
      });
      
      setShowPayment(true);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (transaction: any) => {
    setShowPayment(false);
    
    if (transaction.status === 'completed') {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } else if (transaction.method === 'cod') {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const handleGuestCheckout = () => {
    setShowLoginPrompt(false);
    setShowCheckout(true);
  };

  const handleLoginRedirect = () => {
    if (onAuthClick) {
      onAuthClick();
      onClose();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="min-h-screen flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl max-w-5xl w-full shadow-2xl border border-white/10 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {!showCheckout ? (
              // Product Display Page
              <div>
                <div className="relative bg-gradient-to-r from-orange-600/20 to-red-600/20 px-8 py-8 text-center border-b border-white/10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-block p-4 bg-orange-500/20 rounded-full mb-4"
                  >
                    <Flame className="w-12 h-12 text-orange-500" />
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Ignis Secura</h2>
                  <p className="text-xl text-gray-400">Smart Gas Safety Regulator</p>
                  {isAuthenticated && user && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm">Logged in as {user.name}</span>
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image and Features */}
                    <div className="space-y-6">
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 p-8 border border-white/10">
  <motion.img 
    src={gasDeviceImage}
    alt="Ignis Secura Smart Gas Regulator"
    className="w-full h-auto rounded-xl"
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
</div>

                      <div className="space-y-3">
                        <h3 className="text-white font-semibold text-lg mb-3">Key Features:</h3>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Zap className="w-5 h-5 text-orange-500" />
                          <span>Instant gas leak detection</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Smartphone className="w-5 h-5 text-orange-500" />
                          <span>Real-time mobile alerts</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Shield className="w-5 h-5 text-orange-500" />
                          <span>Automatic gas shutoff</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span>24/7 continuous monitoring</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Details and Purchase */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">About This Product</h3>
                        <p className="text-gray-400 leading-relaxed">
                          Ignis Secura is an advanced smart gas safety device that protects your home from LPG gas leaks. 
                          With highly sensitive sensors and real-time alerts, it provides complete peace of mind for your kitchen safety.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Regular Price:</span>
                          <span className="text-white text-2xl font-bold">₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-green-500 font-semibold">In Stock - Pre-order Available</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-medium">Quantity:</span>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleQuantityChange(-1)}
                              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white text-2xl font-semibold min-w-[40px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(1)}
                              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-lg">Total:</span>
                            <span className="text-white text-3xl font-bold">₹{parseInt(totalPrice).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-green-500 text-sm">
                          <Truck className="w-4 h-4" />
                          <span>Free shipping worldwide</span>
                        </div>
                        <div className="flex items-center gap-3 text-green-500 text-sm">
                          <Shield className="w-4 h-4" />
                          <span>2-year warranty included</span>
                        </div>
                        <div className="flex items-center gap-3 text-green-500 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>30-day money-back guarantee</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyClick}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                      >
                        {isAuthenticated ? 'Buy Now' : 'Sign in to Purchase'}
                      </motion.button>

                      {!isAuthenticated && (
                        <p className="text-center text-gray-500 text-xs">
                          Sign in to track your order and get exclusive offers
                        </p>
                      )}

                      <p className="text-center text-gray-500 text-xs">
                        Secure checkout • SSL Encrypted • Money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Checkout Page
              <div>
                <div className="relative bg-orange-600/10 px-8 py-6 text-center border-b border-white/10">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Checkout</h2>
                  <p className="text-gray-400">Complete your pre-order</p>
                </div>

                {!isSuccess ? (
                  <form onSubmit={handleCompleteOrder} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Shipping Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                              pattern="[0-9]{10}"
                              maxLength={10}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Street Address *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 space-y-4">
                          <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
                          
                          <div className="flex justify-between text-gray-300">
                            <span>Ignis Secura Device</span>
                            <span>₹{price.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Quantity</span>
                            <span>x{quantity}</span>
                          </div>
                          <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between text-white font-semibold">
                              <span className="text-lg">Total</span>
                              <span className="text-2xl text-orange-500">₹{parseInt(totalPrice).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {isAuthenticated && (
                          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                            <p className="text-green-500 text-sm">
                              ✓ Account verified - Order will be saved to your account
                            </p>
                          </div>
                        )}

                        <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                          <p className="text-orange-500 text-sm text-center">
                            You will be redirected to payment after confirming order
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing Order...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5" />
                              Proceed to Payment
                            </>
                          )}
                        </button>

                        <p className="text-center text-gray-500 text-xs">
                          By completing this order, you agree to our Terms of Service
                        </p>
                      </div>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="inline-block p-4 bg-green-500/20 rounded-full mb-6"
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">Order Confirmed!</h3>
                    <p className="text-gray-400 mb-4">
                      Thank you for pre-ordering Ignis Secura!
                    </p>
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <p className="text-white font-semibold mb-2">Order Summary:</p>
                      <p className="text-gray-400">Quantity: {quantity} unit(s)</p>
                      <p className="text-orange-500 text-xl font-bold mt-2">Total: ₹{parseInt(totalPrice).toLocaleString('en-IN')}</p>
                    </div>
                    {isAuthenticated ? (
                      <div className="bg-blue-500/10 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">
                          ✓ Order saved to your account • Track in your dashboard
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/10 rounded-xl p-4">
                        <p className="text-yellow-500 text-sm">
                          Create an account to track your order status
                        </p>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm mt-4">
                      We'll send a confirmation email shortly with your order details.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Login Prompt Modal */}
            <AnimatePresence>
              {showLoginPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-20"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 max-w-md mx-4 text-center border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-block p-4 bg-orange-500/20 rounded-full mb-4">
                      <LogIn className="w-12 h-12 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Sign In Required</h3>
                    <p className="text-gray-400 mb-6">
                      Create an account or sign in to complete your pre-order and track your order status in real-time.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={handleLoginRedirect}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-3 rounded-xl font-semibold transition-all"
                      >
                        Sign In / Create Account
                      </button>
                      <button
                        onClick={handleGuestCheckout}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                      >
                        Continue as Guest
                      </button>
                      <button
                        onClick={() => setShowLoginPrompt(false)}
                        className="w-full text-gray-500 hover:text-gray-400 py-2 text-sm transition-colors"
                      >
                        Back to Product
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Payment Modal – with userDetails passed */}
      {showPayment && (
        <PaymentModal
          amount={parseFloat(totalPrice)}
          orderId={currentOrderId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
          userDetails={{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }}
        />
      )}
    </>
  );
};

export default PreOrderPage;