import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../lib/api', () => {
  const submitAppointment = vi.fn().mockResolvedValue({ referenceCode: 'AP-000001' })
  const fetchDoctors = vi.fn().mockResolvedValue([
    {
      id: 'd1',
      name: 'นพ. ตัวอย่าง หนึ่ง',
      department: 'อายุรกรรม',
      specialty: 'หัวใจ',
      position: 'แพทย์',
      phone: '020000000',
      schedule: []
    }
  ])
  return {
    api: {
      fetchDoctors,
      submitAppointment
    }
  }
})

import { AppointmentForm } from '../AppointmentForm'

describe('AppointmentForm', () => {
  const user = userEvent.setup()

  it('allows users to submit an appointment when form is valid', async () => {
    render(<AppointmentForm />)

    const departmentSelect = await screen.findByLabelText('เลือกแผนกที่ต้องการเข้ารับบริการ')
    const doctorSelect = await screen.findByLabelText('เลือกแพทย์')

    const fullNameInput = screen.getByLabelText('ชื่อ-นามสกุลผู้ป่วย')
    await user.type(fullNameInput, 'สมชาย ใจดี')
    expect(fullNameInput).toHaveValue('สมชาย ใจดี')
    await user.type(screen.getByLabelText('เลขบัตรประชาชน 13 หลัก'), '1234567890123')
    await user.type(screen.getByLabelText('รหัสผู้ป่วย (ถ้ามี)'), 'PT1001')

    fireEvent.change(departmentSelect, { target: { value: 'อายุรกรรม' } })
    await screen.findByRole('option', { name: /นพ\. ตัวอย่าง หนึ่ง/ })
    fireEvent.change(doctorSelect, { target: { value: 'd1' } })

    fireEvent.change(screen.getByLabelText('วันที่ต้องการนัดหมาย'), { target: { value: '2024-12-01' } })
    fireEvent.change(screen.getByLabelText('เวลาที่ต้องการนัดหมาย'), { target: { value: '09:30' } })
    await user.type(screen.getByLabelText('CAPTCHA ป้องกันสแปม (กรุณากรอก 1234)'), '1234')

    const consentCheckbox = screen.getByRole('checkbox', {
      name: /ข้าพเจ้าตกลงให้โรงพยาบาลจัดเก็บ/
    })
    await user.click(consentCheckbox)

    await user.click(screen.getByRole('button', { name: 'ยืนยันการนัดหมาย' }))

    expect(await screen.findByText(/ส่งคำขอนัดหมายสำเร็จ/)).toBeInTheDocument()
  })
})
