import React from 'react'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message?: string
  className?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null

  return <span className={`${styles.errorMessage} ${className || ''}`}>{message}</span>
}

export default ErrorMessage
