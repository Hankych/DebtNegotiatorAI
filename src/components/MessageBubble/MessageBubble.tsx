'use client';

import React from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types/Chat';
import { extractPaymentDetails } from '@/utils/UtilsPayment';
import PaymentPlanCard from './PaymentPlanCard';
import styles from '@/styles/MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
  timestamp?: Date;
}

export default function MessageBubble({ message, timestamp = new Date() }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isPaymentPlan =  !!message.payment_url;
  const paymentDetails = isPaymentPlan ? extractPaymentDetails(message.content, message.payment_url) : null;
  const shouldShowPaymentPlan = isPaymentPlan && paymentDetails && paymentDetails.paymentAmount;

  // If it's a user message or there's no payment plan, show regular message
  if (isUser || !shouldShowPaymentPlan) {
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
            <div className={`whitespace-pre-wrap leading-relaxed ${styles.message__text}`}>
              {message.content}
            </div>
          </div>
        </div>
        
        {isUser && <div className={styles.message__logo} />}
      </div>
    );
  }

  // If there's a payment plan, only show the payment card
  return (
    <div className={`${styles.message} ${styles['message--assistant']}`}>
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
      
      <div className={`${styles.message__content} ${styles['message__content--assistant']}`}>
        <div className={styles.message__header}>
          <span>CollectWise AI Assistant</span>
          <span>•</span>
          <span>{timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
        
        <div className={`${styles.message__bubble} ${styles['message__bubble--assistant']}`}>
          <PaymentPlanCard
            paymentDetails={paymentDetails}
            onProceedToPayment={() => window.open(message.payment_url, '_blank')}
          />
        </div>
      </div>
    </div>
  );
} 