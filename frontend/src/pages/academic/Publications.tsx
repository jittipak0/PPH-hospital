import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const publicationCategories = [
  {
    title: 'งานวิจัยด้านโรคไม่ติดต่อเรื้อรัง (NCDs)',
    description: 'ศึกษาแนวทางดูแลผู้ป่วยเบาหวาน ความดันโลหิตสูง และโรคหัวใจ โดยร่วมมือกับโรงพยาบาลชุมชนในเครือข่าย'
  },
  {
    title: 'นวัตกรรมการพยาบาล',
    description: 'พัฒนากระบวนการดูแลผู้ป่วยติดเตียงและระบบติดตามผู้ป่วยหลังจำหน่าย ด้วยอุปกรณ์ IoT และ Telemonitoring'
  },
  {
    title: 'สุขภาพจิตและการบำบัดฟื้นฟู',
    description: 'ลงพื้นที่วิจัยการดูแลผู้ป่วยซึมเศร้าและผู้ป่วยยาเสพติดเพื่อสร้างต้นแบบการดูแลร่วมกับชุมชน'
  },
  {
    title: 'การบริหารจัดการบริการสุขภาพ',
    description: 'ศึกษาระบบนัดหมายอัจฉริยะ การบริหารเวชภัณฑ์ และการลดเวลารอคอยของผู้ป่วยนอก'
  }
]

const featuredPapers = [
  {
    title: 'ระบบพยากรณ์ภาวะแทรกซ้อนในผู้ป่วยเบาหวานด้วย Machine Learning',
    authors: 'นพ. ศาสตรา ธรรมคุณ และคณะ',
    journal: 'วารสารการแพทย์ไทย ปี 2566',
    link: '#'
  },
  {
    title: 'การพัฒนารูปแบบ Home Health Monitoring สำหรับผู้สูงอายุ',
    authors: 'พว. สุนิสา ประสิทธิสุข และคณะ',
    journal: 'Nursing Innovation Journal ปี 2565',
    link: '#'
  },
  {
    title: 'การลดเวลารอคอยในแผนกอุบัติเหตุฉุกเฉินด้วย Lean Management',
    authors: 'น.ส. กัญญารัตน์ บุญประเสริฐ และคณะ',
    journal: 'Healthcare Administration Review ปี 2564',
    link: '#'
  }
]

export const PublicationsPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ผลงานวิชาการ | โรงพยาบาลโพนพิสัย"
        description="คลังผลงานวิชาการ งานวิจัย และนวัตกรรมทางการแพทย์จากทีมโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'ฐานข้อมูลผลงานวิชาการโรงพยาบาลโพนพิสัย',
          description: 'รวบรวมผลงานวิจัยและนวัตกรรมด้านการแพทย์ การพยาบาล และระบบสุขภาพจากบุคลากรโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>ผลงานวิชาการและการวิจัย</h1>
        <p>
          เราสนับสนุนให้บุคลากรผลิตองค์ความรู้ใหม่และเผยแพร่สู่สาธารณะ เพื่อยกระดับคุณภาพการรักษาและการบริหารจัดการระบบสาธารณสุขในระดับภูมิภาค
        </p>
      </Container>

      <PageSection
        id="categories"
        title="หัวข้อวิจัยที่ดำเนินการ"
        description="เน้นตอบโจทย์ปัญหาสุขภาพของประชาชนในพื้นที่และพัฒนากระบวนการทำงานภายใน"
      >
        <Grid columns={4}>
          {publicationCategories.map((category) => (
            <article key={category.title} className="card">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="papers"
        title="ผลงานเด่นประจำปี"
        description="ต่อไปนี้เป็นผลงานที่ได้รับการตีพิมพ์และนำไปใช้จริงในระบบบริการ"
        background="muted"
      >
        <div className="card">
          <ul>
            {featuredPapers.map((paper) => (
              <li key={paper.title}>
                <strong>{paper.title}</strong> — {paper.authors} ({paper.journal})
              </li>
            ))}
          </ul>
          <p>
            สามารถค้นหาฉบับเต็มและฐานข้อมูลเพิ่มเติมได้ที่ระบบคลังความรู้ภายใน (Intranet &gt; Research Repository) หรือส่งอีเมลมาที่ research@pph-hospital.go.th
          </p>
        </div>
      </PageSection>
    </div>
  )
}
