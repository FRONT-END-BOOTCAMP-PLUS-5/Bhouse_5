import React from 'react'
import styles from './Message.module.css'

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'info'
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error', className = '' }) => {
  if (!message) return null

  return (
    <div className={`${styles.errorMessage} ${styles[type]} ${className}`} role="alert" aria-live="polite">
      <span className={styles.icon}>
        {type === 'error' && '⚠️'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className={styles.text}>{message}</span>
    </div>
  )
}
