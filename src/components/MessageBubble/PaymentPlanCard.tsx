'use client';

import React from 'react';
import { PaymentDetails } from '@/types/Payment';
import styles from '@/styles/MessageBubble.module.css';

interface PaymentPlanCardProps {
  paymentDetails: PaymentDetails;
  onProceedToPayment: () => void;
}

export default function PaymentPlanCard({ paymentDetails, onProceedToPayment }: PaymentPlanCardProps) {
  const { paymentAmount, totalAmount, term, frequency = 'monthly' } = paymentDetails;

  // Format term to include correct units based on frequency
  const formattedTerm = () => {
    switch (frequency) {
      case 'weekly':
        return `${term} weeks`;
      case 'biweekly':
        // Convert biweekly payments to weeks by multiplying by 2
        return `${Number(term) * 2} weeks`;
      case 'monthly':
        return `${term} ${term === '1' ? 'month' : 'months'}`;
      default:
        return term;
    }
  };

  // Get the payment frequency label
  const getPaymentLabel = () => {
    switch (frequency.toLowerCase()) {
      case 'weekly':
        return 'Weekly Payment';
      case 'biweekly':
        return 'Biweekly Payment';
      default:
        return 'Monthly Payment';
    }
  };

  // Format amount to always show 2 decimal places
  const formatAmount = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
  };

  return (
    <div className={styles.payment}>
      {/* Header with checkmark */}
      <div className={styles.payment__header}>
        <svg className={styles['payment__header-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Payment Plan Confirmed!</span>
      </div>

      {/* Payment Details */}
      <div className={styles.payment__summary}>
        <div className={styles['payment__summary-row']}>
          <span className={styles['payment__summary-label']}>{getPaymentLabel()}</span>
          <span className={styles['payment__summary-value']}>{formatAmount(paymentAmount)}</span>
        </div>
        <div className={styles['payment__summary-row']}>
          <span className={styles['payment__summary-label']}>Term Length</span>
          <span className={styles['payment__summary-value']}>{formattedTerm()}</span>
        </div>
        <div className={styles['payment__summary-row']}>
          <span className={styles['payment__summary-label']}>Total Amount</span>
          <span className={styles['payment__summary-value']}>{formatAmount(totalAmount)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className={`${styles.payment__actions} flex flex-col items-center`}>
        <button
          onClick={onProceedToPayment}
          className={styles.payment__button}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Proceed to Secure Payment</span>
        </button>
        <div className={styles.payment__help}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Need help? Just ask!</span>
        </div>
      </div>
    </div>
  );
}