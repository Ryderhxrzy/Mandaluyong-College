'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface StrandItem {
  id: string
  program: string
  strandRequirement: string
}

interface RequiredStrandProps {
  items?: StrandItem[]
}

const DEFAULT_ITEMS: StrandItem[] = [
  {
    id: '1',
    program: 'Bachelor of Science in Mathematics',
    strandRequirement: 'STEM, ABM',
  },
  {
    id: '2',
    program: 'Bachelor of Arts in Communication',
    strandRequirement: 'All Strands',
  },
  {
    id: '3',
    program: 'Bachelor of Science in Information Systems',
    strandRequirement: 'STEM, TVL-ICT',
  },
  {
    id: '4',
    program: 'Bachelor of Public Administration',
    strandRequirement: 'All Strands',
  },
  {
    id: '5',
    program: 'Bachelor of Physical Education',
    strandRequirement: 'All Strands',
  },
  {
    id: '6',
    program: 'Bachelor of Science in Nursing',
    strandRequirement: 'All Strands',
  },
]

export default function RequiredStrand({ items = DEFAULT_ITEMS }: RequiredStrandProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const filteredData = useMemo(() => {
    return items.filter(row =>
      row.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.strandRequirement.toLowerCase().includes(searchTerm.toLowerCase())
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
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-heading)' }}>
          Required Strand per Program
        </h2>

        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--section-bg-light)', borderColor: 'var(--border-light)', borderWidth: '1px' }}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                  <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Program</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Strand Requirement</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 dark:border-gray-700 transition ${
                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                      } hover:bg-blue-50 dark:hover:bg-gray-600`}
                    >
                      <td className="px-4 py-3 text-gray-900 dark:text-white text-sm md:text-base">{row.program}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white text-sm md:text-base">{row.strandRequirement}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid var(--border-light)` }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Showing {paginatedData.length > 0 ? currentPage * itemsPerPage + 1 : 0} to{' '}
              {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-primary"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-primary"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
