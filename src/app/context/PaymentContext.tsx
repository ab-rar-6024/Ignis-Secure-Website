// src/app/context/PaymentContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types/payment';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentContextType {
  transactions: Transaction[];
  processRazorpayPayment: (amount: number, orderId: string, userDetails?: any) => Promise<Transaction>;
  processCODPayment: (orderId: string, amount: number) => Promise<Transaction>;
  getTransactionsByUser: (userId: string) => Transaction[];
  getAllTransactions: () => Transaction[];
  updateTransactionStatus: (transactionId: string, status: Transaction['status']) => void;
  isProcessing: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Mock storage (replace with backend API in production)
let mockTransactions: Transaction[] = [];

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load existing transactions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransactions(parsed);
      mockTransactions = parsed;
    }
  }, []);

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    mockTransactions = newTransactions;
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  /**
   * Creates a Razorpay order on your backend and then opens the checkout.
   * Replace the backend URL with your actual API endpoint.
   */
  const createBackendOrder = async (amount: number, orderId: string) => {
    // 🔁 IMPORTANT: Replace with your actual backend endpoint
    const response = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId })
    });
    if (!response.ok) throw new Error('Failed to create payment order');
    return response.json();
  };

  /**
   * Verify payment signature (call your backend after successful payment)
   */
  const verifyPayment = async (paymentData: any) => {
    const response = await fetch('http://localhost:3000/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  };

  const processRazorpayPayment = async (
    amount: number,
    orderId: string,
    userDetails?: { name: string; email: string; phone?: string }
  ): Promise<Transaction> => {
    setIsProcessing(true);
    try {
      // 1. Create Razorpay order via your backend
      const razorpayOrder = await createBackendOrder(amount, orderId);

      // 2. Get Razorpay key from environment variable
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key is missing. Set VITE_RAZORPAY_KEY_ID in .env');
      }

      // 3. Open Razorpay checkout
      return new Promise((resolve, reject) => {
        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Ignis Secura',
          description: `Pre-order for Order #${orderId}`,
          order_id: razorpayOrder.id,
          handler: async (response: any) => {
            // 4. Verify payment on your backend
            const verification = await verifyPayment({
              orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            if (verification.success) {
              const transaction: Transaction = {
                id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                orderId,
                userId: localStorage.getItem('userId') || 'guest',
                amount,
                method: 'razorpay',
                status: 'completed',
                timestamp: new Date().toISOString(),
                transactionId: response.razorpay_payment_id,
              };
              const updated = [...transactions, transaction];
              saveTransactions(updated);
              resolve(transaction);
            } else {
              reject(new Error('Payment verification failed'));
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled by user')),
          },
          prefill: {
            name: userDetails?.name || '',
            email: userDetails?.email || '',
            contact: userDetails?.phone || '',
          },
          theme: { color: '#ea580c' },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Razorpay error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processCODPayment = async (orderId: string, amount: number): Promise<Transaction> => {
    setIsProcessing(true);
    try {
      const transaction: Transaction = {
        id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        userId: localStorage.getItem('userId') || 'guest',
        amount,
        method: 'cod',
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      const updated = [...transactions, transaction];
      saveTransactions(updated);
      return transaction;
    } finally {
      setIsProcessing(false);
    }
  };

  const getTransactionsByUser = (userId: string): Transaction[] => {
    return transactions.filter(t => t.userId === userId);
  };

  const getAllTransactions = (): Transaction[] => transactions;

  const updateTransactionStatus = (transactionId: string, status: Transaction['status']) => {
    const updated = transactions.map(t =>
      t.id === transactionId ? { ...t, status } : t
    );
    saveTransactions(updated);
  };

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        processRazorpayPayment,
        processCODPayment,
        getTransactionsByUser,
        getAllTransactions,
        updateTransactionStatus,
        isProcessing,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within PaymentProvider');
  return context;
};