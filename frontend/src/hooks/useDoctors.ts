import { useEffect, useMemo, useState } from 'react'
import { api, type Doctor } from '../lib/api'

const PAGE_SIZE = 4

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClinic, setSelectedClinic] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const result = await api.fetchDoctors()
        if (!cancelled) {
          setDoctors(result)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError('ไม่สามารถโหลดรายชื่อแพทย์ได้')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filtered = useMemo(() => {
    const byClinic = selectedClinic === 'all'
      ? doctors
      : doctors.filter((doctor) => doctor.department === selectedClinic)

    if (!normalizedSearch) {
      return byClinic
    }

    return byClinic.filter((doctor) =>
      [doctor.name, doctor.department, doctor.specialty]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    )
  }, [doctors, normalizedSearch, selectedClinic])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const departments = useMemo(() => ['all', ...new Set(doctors.map((doctor) => doctor.department))], [doctors])

  return {
    doctors,
    filteredDoctors: paginated,
    totalResults: filtered.length,
    departments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedClinic,
    setSelectedClinic,
    currentPage: page,
    totalPages,
    setPage: setCurrentPage
  }
}
