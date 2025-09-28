import React, { useEffect, useState } from 'react'
import { secureApi } from '../lib/secureApi'
import { PageMeta } from '../components/seo/PageMeta'

export const PrivacyPolicyPage: React.FC = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    secureApi
      .fetchPrivacyPolicy()
      .then((response) => setContent(response.policy))
      .catch(() => setContent('ไม่สามารถโหลดนโยบายความเป็นส่วนตัวได้'))
  }, [])

  return (
    <section className="policy-page">
      <PageMeta
        title="นโยบายความเป็นส่วนตัว | โรงพยาบาลโพนพิสัย"
        description="นโยบายการคุ้มครองข้อมูลส่วนบุคคลและการรักษาความปลอดภัยข้อมูลของโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'นโยบายความเป็นส่วนตัวโรงพยาบาลโพนพิสัย',
          description: 'รายละเอียดการเก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้บริการโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />
      <h1>นโยบายความเป็นส่วนตัว</h1>
      <p>{content}</p>
      <style>{`
        .policy-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 3rem 1rem;
          line-height: 1.8;
        }
        h1 {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </section>
  )
}
