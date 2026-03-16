'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import PossibleCareers from '@/components/academics/programs/course/PossibleCareers'

interface Career {
  id?: number | string
  career_title: string
  career_description: string
}

interface CareersSection {
  id: number
  section_title: string
  section_sub_title: string
  section_description: string
}

export default function CareersPageContent() {
  const searchParams = useSearchParams()
  const programId = searchParams.get('program')
  const [careers, setCareers] = useState<Career[]>([])
  const [programTitle, setProgramTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })

  const [section, setSection] = useState<CareersSection | null>(null)
  const [isEditingSection, setIsEditingSection] = useState(false)
  const [sectionFormData, setSectionFormData] = useState({ title: '', subtitle: '', description: '' })

  const [editingCareerIndex, setEditingCareerIndex] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '' })

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

        // Fetch careers
        const careersResponse = await fetch(`/api/course-details/careers/${programId}`)
        if (careersResponse.ok) {
          const careerData = await careersResponse.json()
          setCareers(Array.isArray(careerData) ? careerData : [])
        }

        // Fetch section content
        const sectionResponse = await fetch(`/api/admin/course-details/careers-section?courseId=${programId}`)
        if (sectionResponse.ok) {
          const sectionData = await sectionResponse.json()
          setSection(sectionData)
          setSectionFormData({
            title: sectionData.section_title || '',
            subtitle: sectionData.section_sub_title || '',
            description: sectionData.section_description || '',
          })
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
        toast.error('Failed to load careers')
      } finally {
        setIsLoading(false)
      }
    }

    const setupRealtimeSubscriptions = () => {
      // Subscribe to course_possible_careers_section changes
      const sectionChannel = supabase
        .channel(`careers_section_realtime_${programId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'course_possible_careers_section' },
          async () => {
            try {
              const sectionResponse = await fetch(`/api/admin/course-details/careers-section?courseId=${programId}`)
              if (sectionResponse.ok) {
                const sectionData = await sectionResponse.json()
                setSection(sectionData)
                setSectionFormData({
                  title: sectionData.section_title || '',
                  subtitle: sectionData.section_sub_title || '',
                  description: sectionData.section_description || '',
                })
              }
            } catch (error) {
              console.error('Error refetching section:', error)
            }
          }
        )
        .subscribe()

      // Subscribe to course_possible_careers changes
      const careersChannel = supabase
        .channel(`careers_realtime_${programId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'course_possible_careers' },
          async () => {
            try {
              const careersResponse = await fetch(`/api/course-details/careers/${programId}`)
              if (careersResponse.ok) {
                const careerData = await careersResponse.json()
                setCareers(Array.isArray(careerData) ? careerData : [])
              }
            } catch (error) {
              console.error('Error refetching careers:', error)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(sectionChannel)
        supabase.removeChannel(careersChannel)
      }
    }

    fetchInitialData()
    const cleanup = setupRealtimeSubscriptions()

    return cleanup
  }, [programId])

  const handleAddCareer = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/careers/${programId}/0`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_title: formData.title,
          career_description: formData.description,
        }),
      })

      if (response.ok) {
        // Refetch careers to ensure preview shows latest data
        const careersResponse = await fetch(`/api/course-details/careers/${programId}`)
        if (careersResponse.ok) {
          const careerData = await careersResponse.json()
          setCareers(Array.isArray(careerData) ? careerData : [])
        }
        setFormData({ title: '', description: '' })
        toast.success('Career added')
      } else {
        toast.error('Failed to add career')
      }
    } catch (error) {
      console.error('Error adding career:', error)
      toast.error('Error adding career')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCareer = async (id: number | string | undefined) => {
    if (!id || !confirm('Delete this career?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/careers/${programId}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        setCareers(careers.filter(c => c.id !== id))
        toast.success('Career removed')
      } else {
        toast.error('Failed to remove career')
      }
    } catch (error) {
      console.error('Error deleting career:', error)
      toast.error('Error removing career')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCareer = (index: number, career: Career) => {
    console.log('Editing career at index:', index, career)
    setEditingCareerIndex(index)
    setEditFormData({
      title: career.career_title,
      description: career.career_description,
    })
  }

  const handleUpdateCareer = async () => {
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    if (editingCareerIndex === null) return

    const career = careers[editingCareerIndex]
    if (!career.id) {
      toast.error('Career ID not found')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/course-details/careers/${programId}/${career.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_title: editFormData.title,
          career_description: editFormData.description,
        }),
      })

      if (response.ok) {
        // Refetch careers to ensure preview shows latest data
        const careersResponse = await fetch(`/api/course-details/careers/${programId}`)
        if (careersResponse.ok) {
          const careerData = await careersResponse.json()
          setCareers(Array.isArray(careerData) ? careerData : [])
        }
        setEditingCareerIndex(null)
        toast.success('Career updated')
      } else {
        toast.error('Failed to update career')
      }
    } catch (error) {
      console.error('Error updating career:', error)
      toast.error('Error updating career')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSection = async () => {
    if (!sectionFormData.title.trim() || !sectionFormData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!programId) {
      toast.error('Program ID not found')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        course_id: Number(programId),
        section_title: sectionFormData.title,
        section_sub_title: sectionFormData.subtitle,
        section_description: sectionFormData.description,
      }

      console.log('Saving section with payload:', payload)

      const response = await fetch(`/api/admin/course-details/careers-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('Response status:', response.status)
      console.log('Response data:', data)

      if (response.ok) {
        setSection(data)
        setIsEditingSection(false)
        toast.success('Section updated')
      } else {
        console.error('API Error:', data)
        toast.error(data.error || 'Failed to save section')
      }
    } catch (error) {
      console.error('Error saving section:', error)
      toast.error('Error saving section: ' + String(error))
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
    <div className="p-6 w-full space-y-8">
      <div>
        <Link
          href="/admin/pages/academics/programs/course-details"
          className="inline-flex items-center gap-2 text-primary hover:text-[#003a7a] mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Possible Careers</h1>
        <p className="text-gray-600 dark:text-gray-400">{programTitle}</p>
      </div>

      {/* Section Content Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Section Content</h2>
          <button
            onClick={() => {
              if (isEditingSection) {
                setSectionFormData({
                  title: section?.section_title || '',
                  subtitle: section?.section_sub_title || '',
                  description: section?.section_description || '',
                })
              }
              setIsEditingSection(!isEditingSection)
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition cursor-pointer hover:text-[#003a7a]"
          >
            {isEditingSection ? <X size={18} /> : <Edit2 size={18} />}
            {isEditingSection ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditingSection ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={sectionFormData.title}
                onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Subtitle
              </label>
              <textarea
                value={sectionFormData.subtitle}
                onChange={(e) => setSectionFormData({ ...sectionFormData, subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Description
              </label>
              <textarea
                value={sectionFormData.description}
                onChange={(e) => setSectionFormData({ ...sectionFormData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSaveSection}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save Section
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {section ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                  <p className="font-semibold">{section.section_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subtitle</p>
                  <p className="text-sm">{section.section_sub_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="text-sm">{section.section_description}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No section content yet. Click Edit to add.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Careers List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Careers</h2>
          <div className="space-y-3">
            {careers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No careers added yet</p>
            ) : (
              careers.map((career, index) => (
                <div key={career.id || `career-${index}`}>
                  {editingCareerIndex === index ? (
                    // Edit Form
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg space-y-3">
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Career Title"
                      />
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateCareer}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-[#003a7a] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Save size={16} /> Save
                        </button>
                        <button
                          onClick={() => setEditingCareerIndex(null)}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-sm font-medium hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <X size={16} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{career.career_title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{career.career_description}</p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => handleEditCareer(index, career)}
                          disabled={isSaving}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCareer(career.id)}
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
              ))
            )}
          </div>
        </div>

        {/* Add Career Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Career</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Career Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this career path..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddCareer}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Career
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {(careers.length > 0 || (editingCareerIndex !== null && editFormData.title.trim()) || (editingCareerIndex === null && formData.title.trim())) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h2>
          <div className="bg-gray-50 dark:bg-gray-800 py-8 -mx-6 -mb-6 px-6">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {section?.section_title || 'Possible Careers'}
                </h3>
                {section?.section_sub_title && (
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
                    {section.section_sub_title}
                  </p>
                )}
              </div>

              {/* Career Cards Grid with Live Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                {/* Live Preview Card */}
                {editingCareerIndex !== null && editFormData.title.trim() ? (
                  <div className="bg-white dark:bg-gray-700 border-2 border-blue-400 dark:border-blue-500 rounded-lg p-6 md:p-8 text-gray-900 dark:text-white relative">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-semibold text-blue-600 dark:text-blue-400">
                      EDITING
                    </div>
                    <h3 className="text-xl font-bold mb-3">{editFormData.title || '(Career Title)'}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{editFormData.description || '(Career Description)'}</p>
                  </div>
                ) : editingCareerIndex === null && formData.title.trim() ? (
                  <div className="bg-white dark:bg-gray-700 border-2 border-green-400 dark:border-green-500 rounded-lg p-6 md:p-8 text-gray-900 dark:text-white relative">
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs font-semibold text-green-600 dark:text-green-400">
                      NEW
                    </div>
                    <h3 className="text-xl font-bold mb-3">{formData.title || '(Career Title)'}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{formData.description || '(Career Description)'}</p>
                  </div>
                ) : null}

                {/* Saved Careers */}
                {careers.map((career, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 md:p-8 text-gray-900 dark:text-white"
                  >
                    <h3 className="text-xl font-bold mb-3">{career.career_title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{career.career_description}</p>
                  </div>
                ))}
              </div>

              {/* Bottom Text */}
              {section?.section_description && (
                <p className="text-center text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  {section.section_description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
