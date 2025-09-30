import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi, beforeAll } from 'vitest'
import { Home } from '../Home'
import { I18nProvider } from '../../lib/i18n'
import { queryKeys } from '../../lib/queryKeys'
import { api, type Article, type Clinic, type NewsItem } from '../../lib/api'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

const renderHome = ({
  news,
  articles,
  clinics
}: {
  news?: NewsItem[]
  articles?: Article[]
  clinics?: Clinic[]
} = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  if (news) {
    queryClient.setQueryData(queryKeys.news, news)
  }
  if (articles) {
    queryClient.setQueryData(queryKeys.articles, articles)
  }
  if (clinics) {
    queryClient.setQueryData(queryKeys.clinics, clinics)
  }

  return render(
    <MemoryRouter>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </I18nProvider>
    </MemoryRouter>
  )
}

const createNews = (): NewsItem[] => [
  {
    id: 'n1',
    title: 'ข่าวทดสอบ',
    summary: 'สรุปข่าว',
    content: 'รายละเอียดข่าว',
    publishedAt: new Date().toISOString(),
    imageUrl: 'https://example.com/news.jpg',
    isFeatured: true,
    displayOrder: 1
  }
]

const createArticles = (): Article[] => [
  {
    id: 'a1',
    title: 'บทความสุขภาพ',
    summary: 'สรุปบทความ',
    content: 'รายละเอียดบทความ',
    imageUrl: 'https://example.com/article.jpg'
  }
]

const createClinics = (): Clinic[] => [
  {
    id: 'c1',
    name: 'คลินิกอายุรกรรม',
    description: 'ดูแลผู้ป่วยโรคเรื้อรัง',
    operatingHours: 'จันทร์-ศุกร์ 08:00-16:00'
  }
]

describe('Home', () => {
  it('renders hero content', () => {
    renderHome({ news: createNews(), articles: createArticles(), clinics: createClinics() })

    expect(
      screen.getByRole('heading', {
        name: 'โรงพยาบาลโพนพิสัย ยืนหยัดเพื่อการดูแลสุขภาพของทุกคน'
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'จองคิวแพทย์ออนไลน์' })).toBeInTheDocument()
  })

})
