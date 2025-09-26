import React from 'react'
import styles from './Grid.module.scss'

interface GridProps {
  children: React.ReactNode
  columns?: number
  gap?: string
}

export const Grid: React.FC<GridProps> = ({ children, columns = 3, gap = '1.5rem' }) => {
  const tabletColumns = Math.min(columns, 2)
  const styleVars: React.CSSProperties = {
    '--grid-gap': gap,
    '--grid-columns': columns,
    '--grid-columns-md': tabletColumns,
    '--grid-columns-sm': 1
  } as React.CSSProperties

  return (
    <div className={styles.gridLayout} style={styleVars}>
      {children}
    </div>
  )
}
