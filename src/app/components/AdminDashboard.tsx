import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  X
} from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { getAllTransactions, updateTransactionStatus } = usePayment();
  const { orders: allOrders } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    const allTransactions = getAllTransactions();
    setTransactions(allTransactions);
  }, []);

  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-500' },
    { icon: ShoppingBag, label: 'Total Orders', value: allOrders.length.toString(), color: 'text-blue-500' },
    { icon: CheckCircle, label: 'Completed Payments', value: completedTransactions.length.toString(), color: 'text-emerald-500' },
    { icon: Clock, label: 'Pending COD', value: pendingTransactions.length.toString(), color: 'text-yellow-500' },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleStatusUpdate = (transactionId: string, status: 'completed' | 'failed') => {
    updateTransactionStatus(transactionId, status);
    setTransactions(getAllTransactions());
  };

  const handleExportCSV = () => {
    const csvData = transactions.map(t => ({
      'Order ID': t.orderId.slice(-8),
      'Amount': `$${t.amount}`,
      'Method': t.method.toUpperCase(),
      'Status': t.status,
      'Date': new Date(t.timestamp).toLocaleString(),
      'Transaction ID': t.transactionId || 'N/A'
    }));
    
    const csv = [Object.keys(csvData[0]).join(','), ...csvData.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        className="min-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl p-6 mb-8 border border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage orders and payments</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-500 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                <div className="flex gap-2">
                  {(['all', 'completed', 'pending', 'failed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        filter === f
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {transaction.orderId.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.method === 'upi' ? 'bg-purple-500/20 text-purple-500' :
                            transaction.method === 'netbanking' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {transaction.method.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.method === 'cod' && transaction.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(transaction.id, 'completed')}
                                className="text-green-500 hover:text-green-400 transition-colors text-xs"
                              >
                                Mark Paid
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(transaction.id, 'failed')}
                                className="text-red-500 hover:text-red-400 transition-colors text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {transaction.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;