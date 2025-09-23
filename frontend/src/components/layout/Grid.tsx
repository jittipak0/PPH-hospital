import React from 'react'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number
  gap?: string
  tabletColumns?: number
  mobileColumns?: number
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = '1.5rem',
  tabletColumns,
  mobileColumns,
  className,
  style,
  ...rest
}) => {
  const normalizedColumns = Math.max(1, Math.round(columns))
  const tabletColumnCount = Math.max(
    1,
    Math.round(tabletColumns ?? Math.min(normalizedColumns, 2))
  )
  const mobileColumnCount = Math.max(1, Math.round(mobileColumns ?? 1))

  const baseStyle = React.useMemo<React.CSSProperties>(
    () => ({
      ['--grid-gap' as const]: gap,
      ['--grid-columns' as const]: String(normalizedColumns),
      ['--grid-columns-tablet' as const]: String(tabletColumnCount),
      ['--grid-columns-mobile' as const]: String(mobileColumnCount)
    }),
    [gap, normalizedColumns, tabletColumnCount, mobileColumnCount]
  )

  const mergedStyle = React.useMemo<React.CSSProperties>(
    () => (style ? { ...baseStyle, ...style } : baseStyle),
    [baseStyle, style]
  )

  const classes = React.useMemo(
    () => ['grid', className].filter(Boolean).join(' '),
    [className]
  )

  return (
    <div className={classes} style={mergedStyle} {...rest}>
      {children}
    </div>
  )
}
