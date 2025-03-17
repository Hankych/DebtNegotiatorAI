export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  payment_url?: string;
  timestamp?: Date;
}

import { PaymentPlan } from './Payment';

export interface ChatResponse {
  response: string;
  suggested_term_length?: number;
  suggested_payment_amount?: number;
  is_agreement_reached: boolean;
}

export interface NegotiationState {
  current_plan: PaymentPlan;
  attempts: number;
  is_agreement_reached: boolean;
  last_suggestion: PaymentPlan;
} 