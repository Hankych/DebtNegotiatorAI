import { PaymentDetails, PaymentFrequency } from '../types/Payment';

export const TOTAL_DEBT_AMOUNT = 2400;

export const FREQUENCY_LABELS = {
  biweekly: 'Bi-weekly Payment',
  weekly: 'Weekly Payment',
  monthly: 'Monthly Payment',
} as const;

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export function isPaymentPlanMessage(content: string, paymentUrl?: string): boolean {
  const lowerContent = content.toLowerCase();
  return !!(lowerContent.includes('payment') && paymentUrl);
}

export function extractPaymentDetails(content: string): PaymentDetails | null {
  const lowerContent = content.toLowerCase();
  
  // Check for one-time payment first
  if (lowerContent.includes('one-time payment') || lowerContent.includes('full amount')) {
    return {
      frequency: 'monthly',
      paymentAmount: `${TOTAL_DEBT_AMOUNT.toLocaleString()}`,
      totalAmount: `${TOTAL_DEBT_AMOUNT.toLocaleString()}`,
      term: '1',
    };
  }

  // Look for payment amount and term length in the message
  const monthlyMatch = content.match(/\$(\d+)(?:\s+(?:per|a)\s+month|\s+monthly)/i);
  const weeklyMatch = content.match(/\$(\d+)(?:\s+(?:per|a)\s+week|\s+weekly)/i);
  const biweeklyMatch = content.match(/\$(\d+)(?:\s+(?:per|a)\s+(?:bi-?week|every\s+two\s+weeks)|\s+bi-?weekly)/i);
  const termMatch = content.match(/(\d+)\s*months?/i);

  const paymentMatch = biweeklyMatch || weeklyMatch || monthlyMatch;
  if (paymentMatch) {
    const paymentAmount = paymentMatch[1];
    const term = termMatch ? termMatch[1] : '6'; // Default to 6 months if not specified
    
    let frequency: PaymentFrequency = 'monthly';
    if (biweeklyMatch || lowerContent.includes('biweekly') || lowerContent.includes('bi-weekly')) {
      frequency = 'biweekly';
    } else if (weeklyMatch || lowerContent.includes('weekly')) {
      frequency = 'weekly';
    }
    
    return {
      frequency,
      paymentAmount,
      totalAmount: `${TOTAL_DEBT_AMOUNT.toLocaleString()}`,
      term,
    };
  }
  return null;
}