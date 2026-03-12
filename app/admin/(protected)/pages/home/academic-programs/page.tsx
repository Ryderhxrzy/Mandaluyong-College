'use client'

import { useState, useEffect } from 'react'
import { Upload, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import ProgramsCarousel from '@/components/ProgramsCarousel'

interface AcademicProgram {
  id: number
  title: string
  image: string | null
  order: number
  is_active: boolean
  course_name?: string
}

const STATIC_DATA: AcademicProgram[] = [
  {
    id: 1,
    title: 'Our Programs',
    image: '/administration.jpg',
    order: 1,
    is_active: true,
    course_name: 'Administration',
  },
  {
    id: 2,
    title: 'Our Programs',
    image: '/nursing.webp',
    order: 2,
    is_active: true,
    course_name: 'Nursing',
  },
  {
    id: 3,
    title: 'Our Programs',
    image: '/pe.jpg',
    order: 3,
    is_active: true,
    course_name: 'Physical Education',
  },
]

export default function AcademicProgramsPage() {
  const [programs, setPrograms] = useState<AcademicProgram[]>(STATIC_DATA)
  const [isEditing, setIsEditing] = useState(false)
  const [sectionTitle, setSectionTitle] = useState('Our Programs')
  const [formData, setFormData] = useState<Partial<AcademicProgram>>({
    title: '',
    image: null,
    order: 0,
    is_active: true,
    course_name: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/academic-programs`)
      if (response.ok) {
        const data = await response.json()
        const programsData = data.length > 0 ? data : STATIC_DATA
        setPrograms(programsData)
        if (programsData.length > 0 && programsData[0].title) {
          setSectionTitle(programsData[0].title)
        }
      } else {
        setPrograms(STATIC_DATA)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      setPrograms(STATIC_DATA)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
      }))
      toast.success('Image uploaded successfully!')
    }
  }

  const handleAddProgram = async () => {
    if (!formData.course_name) {
      toast.error('Please enter a course name')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/academic-programs/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_title: sectionTitle,
          image: formData.image,
          order: parseInt(String(formData.order), 10),
          is_active: formData.is_active,
          course_name: formData.course_name,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const newProgram = result.data || result
        setPrograms([...programs, newProgram])
        setFormData({
          title: '',
          image: null,
          order: 0,
          is_active: true,
          course_name: '',
        })
        toast.success('Program added successfully!')
      } else {
        toast.error(result.error || 'Failed to add program')
      }
    } catch (error) {
      console.error('Error adding program:', error)
      toast.error('An error occurred while adding')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProgram = (program: AcademicProgram) => {
    setFormData(program)
    setEditingId(program.id)
    setIsEditing(true)
  }

  const handleUpdateProgram = async () => {
    if (!formData.course_name) {
      toast.error('Please enter a course name')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/academic-programs/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          section_title: sectionTitle,
          image: formData.image,
          order: parseInt(String(formData.order), 10),
          is_active: formData.is_active,
          course_name: formData.course_name,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const updatedProgram = result.data || result
        setPrograms(
          programs.map(p =>
            p.id === editingId
              ? {
                  ...p,
                  ...updatedProgram,
                }
              : p
          )
        )
        setEditingId(null)
        setIsEditing(false)
        setFormData({
          title: '',
          image: null,
          order: 0,
          is_active: true,
          course_name: '',
        })
        toast.success('Program updated successfully!')
      } else {
        toast.error(result.error || 'Failed to update program')
      }
    } catch (error) {
      console.error('Error updating program:', error)
      toast.error('An error occurred while updating')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/academic-programs`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== id))
        if (editingId === id) {
          setEditingId(null)
          setIsEditing(false)
          setFormData({
            title: '',
            image: null,
            order: 0,
            is_active: true,
          })
        }
        toast.success('Program deleted successfully!')
      } else {
        toast.error('Failed to delete program')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleUpdateSectionTitle = async () => {
    if (!sectionTitle.trim()) {
      toast.error('Section title cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/academic-programs/update-section-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_title: sectionTitle }),
      })

      const result = await response.json()

      if (response.ok) {
        setPrograms(
          programs.map(p => ({
            ...p,
            title: sectionTitle,
          }))
        )
        toast.success('Section title updated successfully!')
      } else {
        toast.error(result.error || 'Failed to update section title')
      }
    } catch (error) {
      console.error('Error updating section title:', error)
      toast.error('An error occurred while updating')
    } finally {
      setIsSaving(false)
    }
  }


  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Academic Programs
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Academic Programs
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <>
            {/* Grid Layout: Form (left) and Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                {/* Section Title */}
                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      placeholder="e.g., Our Programs"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleUpdateSectionTitle}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Name (for image naming)
                  </label>
                  <input
                    type="text"
                    value={formData.course_name || ''}
                    onChange={(e) => handleInputChange('course_name', e.target.value)}
                    placeholder="e.g., BSA"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image to Cloudinary
                  </label>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={handleCloudinaryUpload}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload size={18} />
                        {formData.image ? 'Change Image' : 'Click to upload image'}
                      </button>
                    )}
                  </CldUploadWidget>
                  {formData.image && (
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Image Link
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active !== false}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Active
                  </label>
                </div>
              </div>

              {/* Right: Preview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h2>

                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm mb-4">
                  <div className="!py-0">
                    <ProgramsCarousel 
                      title={sectionTitle} 
                      slides={(isEditing && editingId 
                        ? programs.map(p => p.id === editingId ? { ...p, ...formData, id: p.id } : p)
                        : isEditing 
                          ? [...programs, { ...formData, id: Date.now() } as AcademicProgram]
                          : programs
                      ).map(p => ({
                        ...p,
                        title: p.course_name || p.title,
                        is_active: true // Force active in preview so we can see what we're editing
                      }))} 
                    />
                  </div>
                </div>

                {/* Programs List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Programs ({programs.length})
                  </p>
                  {programs.map((program, index) => (
                    <div
                      key={`${program.id}-${index}`}
                      className={`p-3 rounded-lg border-2 transition ${
                        index === 0 // Default to highlighting first one or none
                          ? 'border-primary bg-primary/10 dark:bg-primary/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {program.course_name || program.title}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Order: {program.order}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditProgram(program)
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProgram(program.id)
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    image: null,
                    order: 0,
                    is_active: true,
                  })
                }}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
              >
                Cancel
              </button>
              {editingId ? (
                <button
                  onClick={handleUpdateProgram}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              ) : (
                <button
                  onClick={handleAddProgram}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={18} />
                  {isSaving ? 'Adding...' : 'Add Program'}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Preview Only */}
            <div className="space-y-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>

              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <ProgramsCarousel 
                  title={sectionTitle} 
                  slides={programs.map(p => ({
                    ...p,
                    title: p.course_name || p.title
                  }))} 
                />
              </div>

              {/* Programs List with Edit/Delete */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Programs ({programs.length})
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {programs.map((program, index) => (
                    <div
                      key={`${program.id}-${index}`}
                      className={`p-3 rounded-lg border-2 transition ${
                        index === 0
                          ? 'border-primary bg-primary/10 dark:bg-primary/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {program.course_name || program.title}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Order: {program.order}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-[#003a7a] transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(program.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => {
                  setIsEditing(true)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    image: null,
                    order: 0,
                    is_active: true,
                  })
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
