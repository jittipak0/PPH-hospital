import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, as: Component = 'div', className }) => {
  return (
    <Component className={`container-shell ${className ?? ''}`.trim()}>{children}</Component>
  )
}
