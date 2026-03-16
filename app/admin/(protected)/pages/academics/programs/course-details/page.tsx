'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Program {
  id: string
  title: string
  courseCode?: string
  status: 'available' | 'coming-soon'
}

interface DataCounts {
  [programId: string]: {
    images: number
    careers: number
    curriculum: number
  }
}

export default function CourseDetailsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dataCounts, setDataCounts] = useState<DataCounts>({})

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/admin/programs/featured')
        if (response.ok) {
          const data = await response.json()
          setPrograms(data)

          // Fetch counts for each program
          const counts: DataCounts = {}
          for (const program of data) {
            try {
              // Fetch images count
              const imagesRes = await fetch(`/api/course-details/images/${program.id}`)
              const images = imagesRes.ok ? await imagesRes.json() : []

              // Fetch careers count
              const careersRes = await fetch(`/api/course-details/careers/${program.id}`)
              const careers = careersRes.ok ? await careersRes.json() : []

              // Fetch curriculum count
              const curriculumRes = await fetch(`/api/course-details/curriculum/${program.id}`)
              const curriculumArray = curriculumRes.ok ? await curriculumRes.json() : []
              const curriculumCount = Array.isArray(curriculumArray) ? curriculumArray.reduce((total: number, year: any) => {
                return total + (year.semesters?.reduce((semTotal: number, sem: any) => {
                  return semTotal + (sem.courses?.length || 0)
                }, 0) || 0)
              }, 0) : 0

              counts[program.id] = {
                images: Array.isArray(images) ? images.length : 0,
                careers: Array.isArray(careers) ? careers.length : 0,
                curriculum: curriculumCount,
              }
            } catch (error) {
              console.error(`Error fetching counts for program ${program.id}:`, error)
              counts[program.id] = { images: 0, careers: 0, curriculum: 0 }
            }
          }
          setDataCounts(counts)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Course Details</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    )
  }

  const activePrograms = programs.filter((p) => p.status === 'available')
  const comingSoonPrograms = programs.filter((p) => p.status === 'coming-soon')

  const ProgramCard = ({ program }: { program: Program }) => {
    const counts = dataCounts[program.id] || { images: 0, careers: 0, curriculum: 0 }

    return (
      <div
        key={program.id}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white flex-1">
              {program.title}
            </h3>
            <span className="ml-2 px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 text-xs font-semibold rounded-full">
              ID: {program.id}
            </span>
          </div>
          {program.courseCode && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{program.courseCode}</p>
          )}

          <div className="space-y-2">
            <Link
              href={`/admin/pages/academics/programs/course-details/images?program=${program.id}`}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
            >
              <span className="text-sm font-medium">Course Images</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs font-bold rounded">
                  {counts.images}
                </span>
                <ChevronRight size={16} />
              </div>
            </Link>
            <Link
              href={`/admin/pages/academics/programs/course-details/careers?program=${program.id}`}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition"
            >
              <span className="text-sm font-medium">Possible Careers</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 text-xs font-bold rounded">
                  {counts.careers}
                </span>
                <ChevronRight size={16} />
              </div>
            </Link>
            <Link
              href={`/admin/pages/academics/programs/course-details/curriculum?program=${program.id}`}
              className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
            >
              <span className="text-sm font-medium">Course Curriculum</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 text-xs font-bold rounded">
                  {counts.curriculum}
                </span>
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Course Details Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Select a program to manage its course images, careers, and curriculum.</p>
      </div>

      {/* Active Programs */}
      {activePrograms.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Active Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Programs */}
      {comingSoonPrograms.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Coming Soon Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
            {comingSoonPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      )}

      {programs.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No programs found. Create programs first.</p>
        </div>
      )}
    </div>
  )
}
