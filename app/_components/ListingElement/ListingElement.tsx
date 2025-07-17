'use client'

import React from 'react'
import styles from './ListingElement.module.css'

interface ListingElementProps {
  label: string
  onDelete: () => void
}

const ListingElement: React.FC<ListingElementProps> = ({ label, onDelete }) => {
  return (
    <div className={styles.boardgameItem}>
      <div className={styles.boardgameLabel}>{label}</div>
      <button className={styles.deleteButton} onClick={onDelete} type="button">
        🗑️
      </button>
    </div>
  )
}

export default ListingElement
