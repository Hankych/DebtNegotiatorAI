'use client';

import React from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types/Chat';
import { extractPaymentDetails, isPaymentPlanMessage } from '@/utils/UtilsPayment';
import PaymentPlanCard from './PaymentPlanCard';
import styles from '@/styles/MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
  timestamp?: Date;
}

export default function MessageBubble({ message, timestamp = new Date() }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isPaymentPlan = isPaymentPlanMessage(message.content, message.payment_url);
  const paymentDetails = isPaymentPlan ? extractPaymentDetails(message.content) : null;
  const shouldShowPaymentPlan = isPaymentPlan && paymentDetails && paymentDetails.paymentAmount;

  return (
    <div className={`${styles.message} ${isUser ? styles['message--user'] : styles['message--assistant']}`}>
      {!isUser && (
        <div className={styles.message__logo}>
          <Image 
            src="/images/collectwise_logo.jpg" 
            alt="CollectWise" 
            className={styles['message__logo-image']}
            width={48}
            height={48}
          />
        </div>
      )}
      
      <div className={`${styles.message__content} ${isUser ? styles['message__content--user'] : styles['message__content--assistant']}`}>
        <div className={styles.message__header}>
          <span>{isUser ? 'You' : 'CollectWise AI Assistant'}</span>
          <span>•</span>
          <span>{timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
        
        <div className={`${styles.message__bubble} ${isUser ? styles['message__bubble--user'] : styles['message__bubble--assistant']}`}>
          {shouldShowPaymentPlan ? (
            <PaymentPlanCard
              paymentDetails={paymentDetails}
              onProceedToPayment={() => window.open(message.payment_url, '_blank')}
            />
          ) : (
            <div className={`whitespace-pre-wrap leading-relaxed ${styles.message__text}`}>{message.content}</div>
          )}
          
          {!isUser && message.payment_url && !shouldShowPaymentPlan && (
            <div className={`${styles.message__action} flex justify-center mt-4`}>
              <a
                href={message.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.payment__button}
              >
                <span>Proceed to Payment</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
      
      {isUser && <div className={styles.message__logo} />}
    </div>
  );
} 