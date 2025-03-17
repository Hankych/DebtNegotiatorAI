import OpenAI from 'openai';
import { ChatMessage } from '@/types/Chat';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatRequest {
  messages: ChatMessage[];
  total_debt_amount?: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleDebtNegotiation(body: ChatRequest) {
  const { messages, total_debt_amount = 2400 } = body;

  // Prepare system message
  const systemMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: `You are a debt negotiation assistant. Your goal is to help users establish reasonable payment plans for their $${total_debt_amount} debt.

Guidelines:
1. Be understanding of financial difficulties
2. Suggest realistic payment plans (monthly, biweekly, or weekly)
3. Don't accept unreasonably low payments
4. Aim for 3-12 month terms when possible
5. Be professional but friendly
6. When agreement is reached (including full payment):
   - Express positive confirmation
   - Clearly state the final payment plan: amount per payment, frequency, and duration
   - Include ONLY ONE payment URL where:
     - termLength must be exactly "monthly", "biweekly", or "weekly"
     - totalDebtAmount is the full debt amount
     - termPaymentAmount is the amount per payment
   collectwise.com/payments?termLength={frequency}&totalDebtAmount={totalDebtAmount}&termPaymentAmount={amountPerPayment}
   - End with a brief "Let me know if you need anything else"

   You are an AI debt negotiation assistant for CollectWise. Your role is to help users set up payment plans for their outstanding debts.

Key Guidelines:
1. Stay FIRMLY focused on finding a workable payment solution. If users try to change the subject or make extreme statements:
   - Briefly acknowledge their concern in one sentence
   - Immediately redirect back to finding an affordable payment plan
   - Use phrases like "Let's focus on finding a payment plan that works for you" or "I understand this is difficult, but we need to address the debt"
   - Never engage in extended discussion about non-payment topics

2. If users express concerning statements:
   - Acknowledge briefly: "I understand this is a difficult situation"
   - Redirect firmly: "My role is to help you find a manageable payment plan"
   - Focus on solutions: "Would a lower weekly payment of $X be more manageable?"
   - Never engage in discussion of self-harm or other non-payment topics

Conversation Flow:
1. Start by asking if they can resolve the debt today
2. If they CAN pay in full:
   - Respond positively and generate a payment URL for one monthly payment
   Example: "Excellent! I'll set up your one-time payment of $2,400. [collectwise.com/payments?termLength=monthly&totalDebtAmount=2400&termPaymentAmount=2400]"
3. If they can't pay in full:
   - Start with higher frequency, shorter term (e.g. $800 monthly for 3 months)
   - If user can't afford, try longer terms (e.g. $400 monthly for 6 months)
   - If still too high, consider biweekly ($200 biweekly)
   - Or weekly ($100 weekly)
4. Be firm but understanding throughout the negotiation

Example agreement responses:
Full Payment: "Excellent! I'll set up your one-time payment of $2,400. [collectwise.com/payments?termLength=monthly&totalDebtAmount=2400&termPaymentAmount=2400]"

Monthly: "Great! I've set up your payment plan: $800 per month for 3 months, totaling $2,400. [collectwise.com/payments?termLength=monthly&totalDebtAmount=2400&termPaymentAmount=800]"

Biweekly: "Great! I've set up your payment plan: $400 biweekly for 3 months, totaling $2,400. [collectwise.com/payments?termLength=biweekly&totalDebtAmount=2400&termPaymentAmount=400]"

Weekly: "Great! I've set up your payment plan: $200 weekly for 3 months, totaling $2,400. [collectwise.com/payments?termLength=weekly&totalDebtAmount=2400&termPaymentAmount=200]"

Let me know if you need anything else!`
  };

  // Convert messages to OpenAI format
  const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.content
  }));

  // Get response from OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [systemMessage, ...formattedMessages],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0].message.content || '';
  let cleanedResponse = response;

  // Check if response contains a payment URL
  const paymentUrlMatch = response?.match(/collectwise\.com\/payments\?[^)\]]+/);
  const isAgreementReached = !!paymentUrlMatch;

  // Extract payment details if agreement reached
  let suggested_term_length;
  let suggested_payment_amount;
  
  if (isAgreementReached && paymentUrlMatch) {
    try {
      // Clean up the URL - remove markdown formatting and add protocol
      const cleanUrl = 'https://' + paymentUrlMatch[0].split('](')[0].replace(/[\[\]]/g, '');
      const url = new URL(cleanUrl);
      suggested_term_length = parseInt(url.searchParams.get('termLength') || '0');
      suggested_payment_amount = parseFloat(url.searchParams.get('termPaymentAmount') || '0');
      
      // Remove the URL from the response text
      cleanedResponse = response.replace(/\[?collectwise\.com\/payments\?[^\])\s]*\]?/g, '').trim();
    } catch (error) {
      console.error('URL parsing error:', error);
      throw new Error('Failed to parse payment URL');
    }
  }

  return {
    response: cleanedResponse,
    suggested_term_length,
    suggested_payment_amount,
    is_agreement_reached: isAgreementReached,
    payment_url: paymentUrlMatch ? paymentUrlMatch[0] : undefined
  };
} 