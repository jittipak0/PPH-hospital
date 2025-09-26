import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description: string
  url?: string
  imageUrl?: string
}

const ensureMetaTag = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value)
    })
    document.head.appendChild(element)
  }
  return element
}

export const PageMeta = ({ title, description, url, imageUrl }: PageMetaProps) => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const descriptionMeta = ensureMetaTag('meta[name="description"]', { name: 'description', content: description })
    descriptionMeta.setAttribute('content', description)

    const ogTitle = ensureMetaTag('meta[property="og:title"]', { property: 'og:title', content: title })
    ogTitle.setAttribute('content', title)

    const ogDescription = ensureMetaTag('meta[property="og:description"]', {
      property: 'og:description',
      content: description
    })
    ogDescription.setAttribute('content', description)

    if (url) {
      const ogUrl = ensureMetaTag('meta[property="og:url"]', { property: 'og:url', content: url })
      ogUrl.setAttribute('content', url)
    }

    if (imageUrl) {
      const ogImage = ensureMetaTag('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
      ogImage.setAttribute('content', imageUrl)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, url, imageUrl])

  return null
}

export default PageMeta
