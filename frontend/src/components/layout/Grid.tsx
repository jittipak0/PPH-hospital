import React from 'react'

interface GridProps {
  children: React.ReactNode
  columns?: number
  gap?: string
}

export const Grid: React.FC<GridProps> = ({ children, columns = 3, gap = '1.5rem' }) => {
  return (
    <div className="grid-layout">
      {children}
      <style>{`
        .grid-layout {
          display: grid;
          gap: ${gap};
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        }
        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: repeat(${Math.min(columns, 2)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
