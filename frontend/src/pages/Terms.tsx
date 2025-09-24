import React, { useEffect, useState } from 'react'
import { secureApi } from '../lib/secureApi'

export const TermsPage: React.FC = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    secureApi
      .fetchTerms()
      .then((response) => setContent(response.terms))
      .catch(() => setContent('ไม่สามารถโหลดข้อตกลงการใช้งานได้'))
  }, [])

  return (
    <section className="policy-page">
      <h1>ข้อตกลงการใช้งาน</h1>
      <p>{content}</p>
      <style>{`
        .policy-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 3rem 1rem;
          line-height: 1.8;
        }
      `}</style>
    </section>
  )
}
