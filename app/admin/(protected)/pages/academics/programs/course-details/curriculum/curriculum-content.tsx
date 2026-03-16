'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface Year {
  id: number
  name: string
  semesters: Semester[]
}

interface Semester {
  id: number
  name: string
  courses: Course[]
}

interface Course {
  id: number
  course_code: string
  course_title: string
  units: number
}

export default function CurriculumPageContent() {
  const searchParams = useSearchParams()
  const programId = searchParams.get('program')
  const [curriculum, setCurriculum] = useState<Year[]>([])
  const [programTitle, setProgramTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newCourse, setNewCourse] = useState({
    semesterId: '',
    code: '',
    title: '',
    units: 3,
  })
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ code: '', title: '', units: 3 })

  useEffect(() => {
    if (!programId) {
      setIsLoading(false)
      return
    }

    const fetchInitialData = async () => {
      try {
        // Fetch program info
        const programResponse = await fetch(`/api/admin/programs/featured/${programId}`)
        if (programResponse.ok) {
          const programData = await programResponse.json()
          setProgramTitle(programData.title || programData.course_title)
        }

        // Fetch curriculum
        const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
        if (curriculumResponse.ok) {
          const curriculumData = await curriculumResponse.json()
          setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
        toast.error('Failed to load curriculum')
      } finally {
        setIsLoading(false)
      }
    }

    const setupRealtimeSubscriptions = () => {
      // Subscribe to course_curriculum table changes
      const curriculumChannel = supabase
        .channel(`curriculum_realtime_${programId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'course_curriculum' },
          async () => {
            try {
              const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
              if (curriculumResponse.ok) {
                const curriculumData = await curriculumResponse.json()
                setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
              }
            } catch (error) {
              console.error('Error refetching curriculum:', error)
            }
          }
        )
        .subscribe()

      // Subscribe to curriculum_years changes
      const yearsChannel = supabase
        .channel(`curriculum_years_realtime_${programId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'curriculum_years' },
          async () => {
            try {
              const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
              if (curriculumResponse.ok) {
                const curriculumData = await curriculumResponse.json()
                setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
              }
            } catch (error) {
              console.error('Error refetching curriculum:', error)
            }
          }
        )
        .subscribe()

      // Subscribe to curriculum_semesters changes
      const semestersChannel = supabase
        .channel(`curriculum_semesters_realtime_${programId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'curriculum_semesters' },
          async () => {
            try {
              const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
              if (curriculumResponse.ok) {
                const curriculumData = await curriculumResponse.json()
                setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
              }
            } catch (error) {
              console.error('Error refetching curriculum:', error)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(curriculumChannel)
        supabase.removeChannel(yearsChannel)
        supabase.removeChannel(semestersChannel)
      }
    }

    fetchInitialData()
    const cleanup = setupRealtimeSubscriptions()

    return cleanup
  }, [programId])

  const handleAddCourse = async () => {
    if (!newCourse.semesterId || !newCourse.code.trim() || !newCourse.title.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/curriculum/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester_id: parseInt(newCourse.semesterId),
          course_code: newCourse.code,
          course_title: newCourse.title,
          units: newCourse.units,
        }),
      })

      if (response.ok) {
        toast.success('Course added')
        // Refetch curriculum
        const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
        if (curriculumResponse.ok) {
          const curriculumData = await curriculumResponse.json()
          setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
        }
        setNewCourse({ semesterId: '', code: '', title: '', units: 3 })
      } else {
        toast.error('Failed to add course')
      }
    } catch (error) {
      console.error('Error adding course:', error)
      toast.error('Error adding course')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Delete this course?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/curriculum/${programId}/${courseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        toast.success('Course removed')
        // Refetch curriculum
        const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
        if (curriculumResponse.ok) {
          const curriculumData = await curriculumResponse.json()
          setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
        }
      } else {
        toast.error('Failed to remove course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Error removing course')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id)
    setEditFormData({ code: course.course_code, title: course.course_title, units: course.units })
  }

  const handleUpdateCourse = async () => {
    if (!editFormData.code.trim() || !editFormData.title.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/curriculum/${programId}/${editingCourseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_code: editFormData.code,
          course_title: editFormData.title,
          units: editFormData.units,
        }),
      })

      if (response.ok) {
        toast.success('Course updated')
        // Refetch curriculum
        const curriculumResponse = await fetch(`/api/course-details/curriculum/${programId}`)
        if (curriculumResponse.ok) {
          const curriculumData = await curriculumResponse.json()
          setCurriculum(Array.isArray(curriculumData) ? curriculumData : [])
        }
        setEditingCourseId(null)
      } else {
        toast.error('Failed to update course')
      }
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error('Error updating course')
    } finally {
      setIsSaving(false)
    }
  }

  if (!programId) {
    return (
      <div className="p-6 w-full">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No program selected</p>
          <Link
            href="/admin/pages/academics/programs/course-details"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#003a7a]"
          >
            <ArrowLeft size={18} />
            Back to Course Details
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Link
          href="/admin/pages/academics/programs/course-details"
          className="inline-flex items-center gap-2 text-primary hover:text-[#003a7a] mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Curriculum</h1>
        <p className="text-gray-600 dark:text-gray-400">{programTitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curriculum Display */}
        <div className="lg:col-span-2 space-y-6">
          {curriculum.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No curriculum data yet. Add courses to get started.</p>
            </div>
          ) : (
            curriculum.map((year) => (
              <div key={year.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-700 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">{year.name}</h3>
                </div>
                <div className="p-6 space-y-4">
                  {year.semesters.map((semester) => (
                    <div key={semester.id} className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{semester.name}</h4>
                      <div className="space-y-2">
                        {semester.courses.map((course) => (
                          <div key={course.id}>
                            {editingCourseId === course.id ? (
                              // Edit Form
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg space-y-2">
                                <input
                                  type="text"
                                  value={editFormData.code}
                                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="Course Code"
                                />
                                <input
                                  type="text"
                                  value={editFormData.title}
                                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="Course Title"
                                />
                                <input
                                  type="number"
                                  value={editFormData.units}
                                  onChange={(e) => setEditFormData({ ...editFormData, units: parseInt(e.target.value) })}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="Units"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleUpdateCourse}
                                    disabled={isSaving}
                                    className="flex-1 px-2 py-1 bg-primary text-white rounded text-sm font-medium hover:bg-[#003a7a] disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Save size={14} /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCourseId(null)}
                                    disabled={isSaving}
                                    className="flex-1 px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-sm font-medium hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <X size={14} /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // View Mode
                              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {course.course_code} - {course.course_title}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.units} units</p>
                                </div>
                                <div className="flex gap-2 ml-2">
                                  <button
                                    onClick={() => handleEditCourse(course)}
                                    disabled={isSaving}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer disabled:opacity-50"
                                    title="Edit"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    disabled={isSaving}
                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer disabled:opacity-50"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Course Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Course</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Semester
              </label>
              <select
                value={newCourse.semesterId}
                onChange={(e) => setNewCourse({ ...newCourse, semesterId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select semester...</option>
                {curriculum.map((year) =>
                  year.semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {year.name} - {semester.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Code
              </label>
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                placeholder="e.g., CS101"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="e.g., Introduction to Programming"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Units
              </label>
              <input
                type="number"
                value={newCourse.units}
                onChange={(e) => setNewCourse({ ...newCourse, units: parseInt(e.target.value) })}
                min="1"
                max="6"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddCourse}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
