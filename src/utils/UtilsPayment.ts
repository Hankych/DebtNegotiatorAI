import { PaymentDetails, PaymentFrequency } from '../types/Payment';

// Constants
export const TOTAL_DEBT_AMOUNT = 2400;

export const PAYMENT_CONSTRAINTS = {
  MIN_PAYMENTS: {
    monthly: 100,   // Minimum $100/month
    biweekly: 50,   // Minimum $50/biweekly
    weekly: 25,     // Minimum $25/week
  },
  MAX_TERM_MONTHS: 24,  // Maximum 24 month term
} as const;

export const FREQUENCY_LABELS = {
  biweekly: 'Biweekly Payment',
  weekly: 'Weekly Payment',
  monthly: 'Monthly Payment',
} as const;

// Helper Functions
function isValidPaymentAmount(amount: number, frequency: PaymentFrequency): boolean {
  return (
    amount >= PAYMENT_CONSTRAINTS.MIN_PAYMENTS[frequency] &&
    TOTAL_DEBT_AMOUNT % amount === 0
  );
}

function parsePaymentUrl(paymentUrl: string): { 
  frequency: PaymentFrequency; 
  paymentAmount: number; 
} | null {
  try {
    const url = new URL(paymentUrl);
    const params = new URLSearchParams(url.search);
    
    const frequency = params.get('termLength')?.toLowerCase() as PaymentFrequency;
    const paymentAmount = parseInt(params.get('termPaymentAmount') || '0');

    if (!frequency || !paymentAmount || !isValidPaymentAmount(paymentAmount, frequency)) {
      return null;
    }

    return { frequency, paymentAmount };
  } catch (error) {
    console.error('Error parsing payment URL:', error);
    return null;
  }
}


export function extractPaymentDetails(content: string, paymentUrl?: string): PaymentDetails | null {
  if (!paymentUrl) return null;

  const parsedUrl = parsePaymentUrl(paymentUrl);
  if (!parsedUrl) return null;

  const { frequency, paymentAmount } = parsedUrl;
  const numberOfPayments = TOTAL_DEBT_AMOUNT / paymentAmount;

  return {
    frequency,
    paymentAmount: paymentAmount.toString(),
    totalAmount: TOTAL_DEBT_AMOUNT.toString(),
    term: numberOfPayments.toString(),
  };
}