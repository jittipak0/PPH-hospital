import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { SearchBar } from '../components/patient/SearchBar'
import { ClinicTabs } from '../components/patient/ClinicTabs'
import { DoctorList } from '../components/patient/DoctorList'
import { useDoctors } from '../hooks/useDoctors'
import { useI18n } from '../lib/i18n'

export const Doctors: React.FC = () => {
  const { t } = useI18n()
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
      <Container>
        <header>
          <h1>{t('doctors.title')}</h1>
          <p>{t('doctors.intro')}</p>
        </header>
      </Container>
      <PageSection id="search" title={t('doctors.section.search')}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder={t('doctors.search.placeholder')} />
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
