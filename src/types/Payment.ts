export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface PaymentDetails {
  frequency: PaymentFrequency;
  paymentAmount: string;
  totalAmount: string;
  term: string;
}

export interface PaymentPlan {
  term_length: number;
  total_debt_amount: number;
  term_payment_amount: number;
  payment_frequency: PaymentFrequency;
} 