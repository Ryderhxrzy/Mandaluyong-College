'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ScheduleItem {
  id: string
  date: string
  time: string
  yearLevel: string
  section: string
}

interface EnrollmentScheduleTableProps {
  items?: ScheduleItem[]
}

export default function EnrollmentScheduleTable({ items = [] }: EnrollmentScheduleTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const filteredData = useMemo(() => {
    return items.filter(row =>
      row.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.yearLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.section.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, items])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
              <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Year Level</th>
              <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Section</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-3 text-gray-900 text-sm md:text-base">{row.date}</td>
                  <td className="px-4 py-3 text-gray-900 text-sm md:text-base">{row.time}</td>
                  <td className="px-4 py-3 text-gray-900 text-sm md:text-base">{row.yearLevel}</td>
                  <td className="px-4 py-3 text-gray-900 text-sm md:text-base">{row.section}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length > 0 ? currentPage * itemsPerPage + 1 : 0} to{' '}
          {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-primary"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-primary"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
