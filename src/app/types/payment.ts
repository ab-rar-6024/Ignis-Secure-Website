export interface PaymentDetails {
  method: 'upi' | 'netbanking' | 'cod';
  upiId?: string;
  bankName?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  orderId: string;
  timestamp: string;
}

export interface UPIRequest {
  upiId: string;
  amount: number;
  orderId: string;
  merchantName: string;
}

export interface NetBankingRequest {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
  orderId: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: 'upi' | 'netbanking' | 'cod';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  upiId?: string;
  bankName?: string;
  transactionId?: string;
}