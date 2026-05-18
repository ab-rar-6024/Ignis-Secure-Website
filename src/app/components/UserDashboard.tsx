import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Package, 
  ShoppingBag, 
  LogOut,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { useAuth, Order } from '../context/AuthContext';

interface UserDashboardProps {
  onClose: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onClose }) => {
  const { user, orders, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  if (!user) return null;

  return (
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
        <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl max-w-4xl w-full shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <User className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Account</h2>
                  <p className="text-gray-400">Welcome back, {user.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5 inline mr-2" />
              Orders ({orders.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <User className="w-5 h-5 text-orange-500" />
                        <span>{user.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-5 h-5 text-orange-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-5 h-5 text-orange-500" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Orders</span>
                        <span className="text-white font-bold text-xl">{orders.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Spent</span>
                        <span className="text-orange-500 font-bold text-xl">
                          ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400">Start your first pre-order today!</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Order #{order.id.slice(-8)}</p>
                          <p className="text-white font-semibold">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                          <span className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-400 text-sm">Quantity: {order.quantity} unit(s)</p>
                            <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Total Amount</p>
                            <p className="text-orange-500 text-2xl font-bold">${order.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;