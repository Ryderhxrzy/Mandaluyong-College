'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Course {
  code: string
  title: string
  units: number
}

interface CourseData {
  course_code: string
  course_title: string
  units: number
}

interface Semester {
  name: string
  courses: Course[]
}

interface SemesterData {
  id: number
  name: string
  courses: CourseData[]
}

interface Year {
  name: string
  semesters: Semester[]
}

interface YearData {
  id: number
  name: string
  semesters: SemesterData[]
}

export default function CourseCurriculum({ courseId }: { courseId?: string | null }) {
  const [curriculum, setCurriculum] = useState<Year[]>([])
  const [loading, setLoading] = useState(!!courseId)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('CourseCurriculum - courseId received:', courseId)

    // If no courseId, don't fetch anything
    if (!courseId) {
      console.log('No courseId provided, using default curriculum')
      return
    }

    // Fetch curriculum from API
    let isMounted = true

    const fetchCurriculum = async () => {
      try {
        const url = `/api/course-details/curriculum/${courseId}`
        console.log('Fetching curriculum from:', url)

        const response = await fetch(url)
        console.log('Curriculum API response status:', response.status)

        if (!isMounted) return

        if (response.ok) {
          const data: YearData[] = await response.json()
          console.log('Curriculum data received:', data)
          console.log('Total years:', data.length)

          // Check if we have valid data
          if (data && data.length > 0) {
            // Transform API response to match Year interface
            const transformedCurriculum: Year[] = data.map((year) => ({
              name: year.name,
              semesters: year.semesters.map((semester) => ({
                name: semester.name,
                courses: semester.courses.map((course) => ({
                  code: course.course_code,
                  title: course.course_title,
                  units: course.units,
                })),
              })),
            }))
            console.log('Transformed curriculum:', transformedCurriculum)
            if (isMounted) {
              setCurriculum(transformedCurriculum)
              setError(null)
            }
          } else {
            console.warn('No curriculum data returned from API')
            if (isMounted) {
              setError('No curriculum data found')
              setCurriculum([])
            }
          }
        } else {
          const errorData = await response.json()
          console.error('Curriculum API error:', response.status, errorData)
          if (isMounted) {
            setError(`Failed to load curriculum: ${response.status}`)
            setCurriculum([])
          }
        }
      } catch (error) {
        console.error('Error fetching curriculum:', error)
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Unknown error')
          setCurriculum([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCurriculum()

    // Setup real-time subscriptions
    const curriculumChannel = supabase
      .channel(`curriculum_changes_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_curriculum' },
        async () => {
          // Refetch curriculum when any change occurs
          try {
            const response = await fetch(`/api/course-details/curriculum/${courseId}`)
            if (isMounted && response.ok) {
              const data: YearData[] = await response.json()
              if (data && data.length > 0) {
                const transformedCurriculum: Year[] = data.map((year) => ({
                  name: year.name,
                  semesters: year.semesters.map((semester) => ({
                    name: semester.name,
                    courses: semester.courses.map((course) => ({
                      code: course.course_code,
                      title: course.course_title,
                      units: course.units,
                    })),
                  })),
                }))
                setCurriculum(transformedCurriculum)
                setError(null)
              }
            }
          } catch (error) {
            console.error('Error refetching curriculum:', error)
          }
        }
      )
      .subscribe()

    const yearsChannel = supabase
      .channel(`curriculum_years_changes_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curriculum_years' },
        async () => {
          // Refetch curriculum when years change
          try {
            const response = await fetch(`/api/course-details/curriculum/${courseId}`)
            if (isMounted && response.ok) {
              const data: YearData[] = await response.json()
              if (data && data.length > 0) {
                const transformedCurriculum: Year[] = data.map((year) => ({
                  name: year.name,
                  semesters: year.semesters.map((semester) => ({
                    name: semester.name,
                    courses: semester.courses.map((course) => ({
                      code: course.course_code,
                      title: course.course_title,
                      units: course.units,
                    })),
                  })),
                }))
                setCurriculum(transformedCurriculum)
                setError(null)
              }
            }
          } catch (error) {
            console.error('Error refetching curriculum:', error)
          }
        }
      )
      .subscribe()

    const semestersChannel = supabase
      .channel(`curriculum_semesters_changes_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curriculum_semesters' },
        async () => {
          // Refetch curriculum when semesters change
          try {
            const response = await fetch(`/api/course-details/curriculum/${courseId}`)
            if (isMounted && response.ok) {
              const data: YearData[] = await response.json()
              if (data && data.length > 0) {
                const transformedCurriculum: Year[] = data.map((year) => ({
                  name: year.name,
                  semesters: year.semesters.map((semester) => ({
                    name: semester.name,
                    courses: semester.courses.map((course) => ({
                      code: course.course_code,
                      title: course.course_title,
                      units: course.units,
                    })),
                  })),
                }))
                setCurriculum(transformedCurriculum)
                setError(null)
              }
            }
          } catch (error) {
            console.error('Error refetching curriculum:', error)
          }
        }
      )
      .subscribe()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
      supabase.removeChannel(curriculumChannel)
      supabase.removeChannel(yearsChannel)
      supabase.removeChannel(semestersChannel)
    }
  }, [courseId])

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-900 dark:text-white">
            Course Curriculum
          </h2>
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600 dark:text-gray-400">Loading curriculum...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-900 dark:text-white">
            Course Curriculum
          </h2>
          <div className="flex items-center justify-center py-20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-900 dark:text-white">
          Course Curriculum
        </h2>

        {/* Years */}
        <div className="space-y-20">
          {curriculum && curriculum.length > 0 ? (
            curriculum.map((year: Year, yearIndex: number) => (
            <div key={yearIndex}>
              <h3 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
                {year.name}
              </h3>

              {/* Semesters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {year.semesters.map((semester, semesterIndex) => (
                  <div key={semesterIndex}>
                    <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                      {semester.name}
                    </h4>

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 dark:text-white">
                              COURSE CODE
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 dark:text-white">
                              COURSE TITLE
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">
                              UNITS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {semester.courses.map((course, courseIndex) => (
                            <tr
                              key={courseIndex}
                              className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                            >
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 font-medium">
                                {course.code}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                {course.title}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                                {course.units}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
                            <td colSpan={2} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              TOTAL
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                              {semester.courses.reduce((sum, course) => sum + course.units, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600 dark:text-gray-400">No curriculum data available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
