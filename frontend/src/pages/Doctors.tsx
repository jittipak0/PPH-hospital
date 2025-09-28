import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { SearchBar } from '../components/patient/SearchBar'
import { ClinicTabs } from '../components/patient/ClinicTabs'
import { DoctorList } from '../components/patient/DoctorList'
import { PageMeta } from '../components/seo/PageMeta'
import { useDoctors } from '../hooks/useDoctors'

export const Doctors: React.FC = () => {
  const {
    filteredDoctors,
    totalResults,
    departments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedClinic,
    setSelectedClinic,
    currentPage,
    totalPages,
    setPage
  } = useDoctors()

  return (
    <div>
      <PageMeta
        title="ค้นหาแพทย์ | โรงพยาบาลโพนพิสัย"
        description="ค้นหารายชื่อแพทย์เฉพาะทาง ตารางออกตรวจ และความชำนาญของแพทย์โรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'รายชื่อแพทย์โรงพยาบาลโพนพิสัย',
          description: 'ค้นหาแพทย์ตามชื่อหรือสาขาความเชี่ยวชาญ พร้อมดูตารางออกตรวจล่าสุด',
          type: 'article'
        }}
      />
      <Container>
        <header>
          <h1>ค้นหาแพทย์</h1>
          <p>ค้นหาตามชื่อ แผนก หรือความเชี่ยวชาญ พร้อมดูตารางออกตรวจของแพทย์แต่ละท่านได้ทันที</p>
        </header>
      </Container>
      <PageSection id="search" title="ค้นหารายชื่อแพทย์">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ค้นหาแพทย์ตามชื่อหรือสาขา" />
        <ClinicTabs departments={departments} selected={selectedClinic} onSelect={(value) => {
          setSelectedClinic(value)
          setPage(1)
        }} />
        <DoctorList
          doctors={filteredDoctors}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setPage}
          loading={loading}
          error={error}
        />
      </PageSection>
    </div>
  )
}
