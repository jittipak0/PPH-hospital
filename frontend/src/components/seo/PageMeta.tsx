import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export type OpenGraphMeta = {
  title?: string
  description?: string
  type?: string
  image?: string
  url?: string
}

export type PageMetaProps = {
  title: string
  description: string
  openGraph?: OpenGraphMeta
}

const ensureMetaTag = (key: string, value: string, attr: 'name' | 'property' = 'name') => {
  if (typeof document === 'undefined') {
    return
  }

  const attribute = attr === 'name' ? 'name' : 'property'
  const selector = `${attribute}="${key}"`
  let element = document.head.querySelector(`meta[${selector}]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

const resolveUrl = (pathname: string): string => {
  if (typeof window === 'undefined') {
    return pathname
  }

  try {
    return new URL(pathname, window.location.origin).toString()
  } catch (error) {
    console.warn('Failed to resolve URL for Open Graph', error)
    return `${window.location.origin}${pathname}`
  }
}

export function PageMeta({ title, description, openGraph }: PageMetaProps): null {
  const location = useLocation()

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.title = title
    ensureMetaTag('description', description)

    const resolvedUrl = openGraph?.url ?? resolveUrl(location.pathname)
    ensureMetaTag('og:title', openGraph?.title ?? title, 'property')
    ensureMetaTag('og:description', openGraph?.description ?? description, 'property')
    ensureMetaTag('og:type', openGraph?.type ?? 'website', 'property')
    ensureMetaTag('og:url', resolvedUrl, 'property')

    if (openGraph?.image) {
      ensureMetaTag('og:image', openGraph.image, 'property')
    }
  }, [description, location.pathname, openGraph?.description, openGraph?.image, openGraph?.title, openGraph?.type, openGraph?.url, title])

  return null
}
