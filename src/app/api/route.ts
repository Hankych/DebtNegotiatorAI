import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMessage } from '@/types/Chat';
import { handleDebtNegotiation } from './debtNegotiator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  messages: ChatMessage[];
  total_debt_amount?: number;
  current_term_length?: number;
  current_payment_amount?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // You could add more API endpoints here in the future
    // For example:
    // if (body.type === 'payment_verification') {
    //   return handlePaymentVerification(body);
    // }
    
    // Default to debt negotiation
    const result = await handleDebtNegotiation(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 