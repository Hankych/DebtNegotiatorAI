'use client';

import styles from '@/styles/MessageBubble.module.css';

interface MessageHeaderProps {
  isUser: boolean;
  timestamp: Date;
}

export default function MessageHeader({ isUser, timestamp }: MessageHeaderProps) {
  return (
    <div className={`${styles.message__header} ${isUser ? 'justify-end' : 'justify-start'}`}>
      <span>{isUser ? 'You' : 'CollectWise AI Assistant'}</span>
      <span>·</span>
      <span>{timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
    </div>
  );
} 