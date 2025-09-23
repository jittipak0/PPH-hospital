import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DoctorList } from '../DoctorList'
import type { Doctor } from '../../../lib/api'
import { I18nProvider } from '../../../lib/i18n'

const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'นพ. ธนากร ใจดี',
    department: 'อายุรกรรม',
    specialty: 'หัวใจ',
    position: 'แพทย์',
    phone: '020000000',
    schedule: []
  },
  {
    id: 'd2',
    name: 'พญ. ศศิธร วัฒนะ',
    department: 'กุมารเวชกรรม',
    specialty: 'ทารกแรกเกิด',
    position: 'แพทย์',
    phone: '020000001',
    schedule: []
  }
]

describe('DoctorList', () => {
  it('renders doctor cards and handles pagination', async () => {
    const onChangePage = vi.fn()
    const user = userEvent.setup()

    render(
      <I18nProvider>
        <DoctorList
          doctors={mockDoctors}
          totalResults={6}
          currentPage={1}
          totalPages={3}
          onChangePage={onChangePage}
          loading={false}
          error={null}
        />
      </I18nProvider>
    )

    expect(screen.getByText('พบแพทย์ทั้งหมด 6 ราย')).toBeInTheDocument()
    expect(screen.getByText('นพ. ธนากร ใจดี')).toBeInTheDocument()
    expect(screen.getByText('พญ. ศศิธร วัฒนะ')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'ถัดไป' }))
    expect(onChangePage).toHaveBeenCalledWith(2)
  })
})
