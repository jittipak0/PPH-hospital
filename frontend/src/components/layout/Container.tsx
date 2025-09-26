import React from 'react'
import styles from './Container.module.scss'

interface ContainerProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, as: Component = 'div', className }) => {
  return <Component className={`${styles.containerShell} ${className ?? ''}`.trim()}>{children}</Component>
}
