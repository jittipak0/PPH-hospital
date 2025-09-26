import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'
import { SatisfactionSurveyForm } from '../../components/forms/SatisfactionSurveyForm'

export const SatisfactionPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ประเมินความพึงพอใจ"
        description="ส่งความคิดเห็นเพื่อปรับปรุงบริการโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/forms/satisfaction"
      />
      <Container>
        <header>
          <h1>ประเมินความพึงพอใจ</h1>
          <p>เสียงสะท้อนของท่านช่วยให้เราพัฒนาการบริการให้ดียิ่งขึ้น ขอบคุณที่สละเวลาในการตอบแบบประเมิน</p>
        </header>
      </Container>
      <PageSection id="survey" title="แบบประเมินออนไลน์">
        <SatisfactionSurveyForm />
      </PageSection>
      <PageSection id="privacy" title="การคุ้มครองข้อมูลส่วนบุคคล">
        <p>ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อปรับปรุงการบริการเท่านั้น</p>
      </PageSection>
    </div>
  )
}

export default SatisfactionPage
