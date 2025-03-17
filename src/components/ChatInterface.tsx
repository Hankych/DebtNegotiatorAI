'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/Chat';
import MessageBubble from './MessageBubble/MessageBubble';
import styles from '../styles/ChatInterface.module.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState<(ChatMessage & { timestamp: Date })[]>([
    {
      role: 'assistant',
      content: 'Hello! Our records show that you currently owe $2400. Are you able to resolve this debt today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus input on mount
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
        payment_url: data.payment_url,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <header className={styles.chatHeader}>
        <div className={styles.chatHeaderInner}>
          <div className={styles.chatLogoWrapper}>
            <div className={styles.chatLogoGlow}></div>
            <img
              src="/images/collectwise_logo.jpg"
              alt="CollectWise"
              className={styles.chatLogo}
            />
          </div>
          <div className={styles.chatTitleWrapper}>
            <h1 className={styles.chatTitle}>
              Debt Payment Plan
            </h1>
            <p className={styles.chatSubtitle}>
              Let's work out a manageable payment solution together
            </p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className={styles.chatMessagesContainer}>
        <div className={styles.chatMessagesInner}>
          {messages.length === 0 ? (
            <div className={styles.chatEmptyState}>
              <div className={styles.chatEmptyStateWrapper}>
                <div className={styles.chatEmptyStateGlow}></div>
                <div className={styles.chatEmptyStateContent}>
                  <div className={styles.chatEmptyStateIconWrapper}>
                    <svg className={styles.chatEmptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={styles.chatEmptyStateTitle}>Welcome to the Debt Negotiator</h3>
                    <p className={styles.chatEmptyStateText}>Start the conversation to explore your payment options.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble key={index} message={message} timestamp={message.timestamp} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.chatLoadingWrapper}>
          <div className={styles.chatLoadingInner}>
            <div className={styles.chatLoadingGlow}></div>
            <div className={styles.chatLoadingContent}>
              <div className={styles.chatLoadingDots}>
                <div className={styles.chatLoadingDot} style={{ animationDelay: '0ms' }} />
                <div className={styles.chatLoadingDot} style={{ animationDelay: '150ms' }} />
                <div className={styles.chatLoadingDot} style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className={styles.chatInputContainer}>
        <div className={styles.chatInputInner}>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className={styles.chatInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={styles.chatSubmitButton}
            >
              <div className={styles.chatSubmitButtonContent}>
                <span>{isLoading ? 'Sending...' : 'Send'}</span>
                <svg className={styles.chatSubmitButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}