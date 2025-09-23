import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, as: Component = 'div', className }) => {
  return (
    <Component className={`container-shell ${className ?? ''}`.trim()}>
      {children}
      <style>{`
        .container-shell {
          width: min(1120px, 92vw);
          margin: 0 auto;
        }
      `}</style>
    </Component>
  )
}
