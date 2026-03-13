'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ApplyRequirementsAndProcedure from '@/components/apply/ApplyRequirementsAndProcedure'

interface RequirementItemDB {
  id: number
  apply_page_id: number
  description: string
  order: number
  created_at: string
}

interface ProcedureStepDB {
  id: number
  apply_page_id: number
  step_number: number
  description: string
  order: number
  created_at: string
}

interface ApplyPageData {
  id: number
  title: string
  enrollment_period: string
  enrollment_dates: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ApplyRequirementsPage() {
  const [pageData, setPageData] = useState<ApplyPageData | null>(null)
  const [requirements, setRequirements] = useState<RequirementItemDB[]>([])
  const [procedures, setProcedures] = useState<ProcedureStepDB[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<RequirementItemDB> | null>(null)
  const [editingProcedure, setEditingProcedure] = useState<Partial<ProcedureStepDB> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingProcedure, setIsSavingProcedure] = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)
  const [headerData, setHeaderData] = useState<Partial<ApplyPageData> | null>(null)
  const [isSavingHeader, setIsSavingHeader] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      // Fetch page data
      const pageResponse = await fetch(`${apiUrl}/api/admin/apply`)
      if (pageResponse.ok) {
        const result = await pageResponse.json()
        if (result?.id) {
          setPageData(result)
        }
      } else {
        // Use mock page data
        setPageData({
          id: 1,
          title: 'Enrollment Procedure (Continuing Students)',
          enrollment_period: 'A.Y. 2025–2026 (1st Semester)',
          enrollment_dates: 'June 16–20, 2025',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Fetch requirements
      const reqResponse = await fetch(`${apiUrl}/api/admin/apply/requirements`)
      if (reqResponse.ok) {
        const data = await reqResponse.json()
        setRequirements(Array.isArray(data) ? data : [])
      } else {
        // Use mock requirements
        setRequirements([
          {
            id: 1,
            apply_page_id: 1,
            description: 'Certificate of Registration (2nd Sem: A.Y. 2024-2025)',
            order: 1,
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            apply_page_id: 1,
            description: 'Duly Signed Clearance (2nd Sem, A.Y. 2024-2025)',
            order: 2,
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            apply_page_id: 1,
            description: 'Program of Study Evaluation Form',
            order: 3,
            created_at: new Date().toISOString(),
          },
        ])
      }

      // Fetch procedures
      const procResponse = await fetch(`${apiUrl}/api/admin/apply/procedure`)
      if (procResponse.ok) {
        const data = await procResponse.json()
        setProcedures(Array.isArray(data) ? data : [])
      } else {
        // Use mock procedures
        setProcedures([
          {
            id: 1,
            apply_page_id: 1,
            step_number: 1,
            description: 'Submit the signed Clearance and Evaluated Program of Study to the Registrar Office.',
            order: 1,
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            apply_page_id: 1,
            step_number: 2,
            description: 'Receive the Certificate of Registration with academic schedule.',
            order: 2,
            created_at: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Use mock data on error
      setPageData({
        id: 1,
        title: 'Enrollment Procedure (Continuing Students)',
        enrollment_period: 'A.Y. 2025–2026 (1st Semester)',
        enrollment_dates: 'June 16–20, 2025',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setRequirements([
        {
          id: 1,
          apply_page_id: 1,
          description: 'Certificate of Registration (2nd Sem: A.Y. 2024-2025)',
          order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          apply_page_id: 1,
          description: 'Duly Signed Clearance (2nd Sem, A.Y. 2024-2025)',
          order: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          apply_page_id: 1,
          description: 'Program of Study Evaluation Form',
          order: 3,
          created_at: new Date().toISOString(),
        },
      ])
      setProcedures([
        {
          id: 1,
          apply_page_id: 1,
          step_number: 1,
          description: 'Submit the signed Clearance and Evaluated Program of Study to the Registrar Office.',
          order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          apply_page_id: 1,
          step_number: 2,
          description: 'Receive the Certificate of Registration with academic schedule.',
          order: 2,
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProcedure = () => {
    setEditingProcedure({
      id: undefined,
      apply_page_id: pageData?.id || 0,
      step_number: procedures.length + 1,
      description: '',
      order: procedures.length + 1,
      created_at: new Date().toISOString(),
    })
  }

  const handleEditProcedure = (item: ProcedureStepDB) => {
    setEditingProcedure(item)
  }

  const handleDeleteProcedure = async (id: number) => {
    if (!confirm('Are you sure you want to delete this step?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/procedure`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setProcedures(procedures.filter((item) => item.id !== id))
        toast.success('Step deleted successfully!')
      } else {
        toast.error('Failed to delete step')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleSaveProcedure = async () => {
    if (!editingProcedure?.description?.trim() || !editingProcedure?.step_number) {
      toast.error('Step number and description are required')
      return
    }

    setIsSavingProcedure(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/procedure/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProcedure),
      })

      const result = await response.json()
      if (response.ok) {
        if (editingProcedure.id) {
          setProcedures(
            procedures.map((item) =>
              item.id === result.data.id ? result.data : item
            )
          )
        } else {
          setProcedures([...procedures, result.data])
        }
        toast.success('Step saved successfully!')
        setEditingProcedure(null)
      } else {
        toast.error(result.error || 'Failed to save step')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingProcedure(false)
    }
  }

  const handleAddItem = () => {
    setEditingItem({
      id: undefined,
      apply_page_id: pageData?.id || 0,
      description: '',
      order: requirements.length + 1,
      created_at: new Date().toISOString(),
    })
    setIsEditing(true)
  }

  const handleEditItem = (item: RequirementItemDB) => {
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/requirements`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setRequirements(requirements.filter((item) => item.id !== id))
        toast.success('Requirement deleted successfully!')
      } else {
        toast.error('Failed to delete requirement')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleSaveItem = async () => {
    if (!editingItem?.description?.trim()) {
      toast.error('Description is required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/requirements/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      })

      const result = await response.json()
      if (response.ok) {
        if (editingItem.id) {
          setRequirements(
            requirements.map((item) =>
              item.id === result.data.id ? result.data : item
            )
          )
        } else {
          setRequirements([...requirements, result.data])
        }
        toast.success('Requirement saved successfully!')
        setIsEditing(false)
        setEditingItem(null)
      } else {
        toast.error(result.error || 'Failed to save requirement')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const mapToPreviewItems = (items: (RequirementItemDB | Partial<RequirementItemDB>)[]) => {
    return items.map((item) => ({
      id: item.id ? item.id.toString() : Math.random().toString(),
      description: item.description || '',
    }))
  }

  const mapToPreviewSteps = (items: (ProcedureStepDB | Partial<ProcedureStepDB>)[]) => {
    return items.map((item) => ({
      id: item.id ? item.id.toString() : Math.random().toString(),
      stepNumber: item.step_number || 0,
      description: item.description || '',
    }))
  }

  const getPreviewItems = () => {
    if (!editingItem) return requirements
    if (editingItem.id) {
      return requirements.map((item) =>
        item.id === editingItem.id ? (editingItem as RequirementItemDB) : item
      )
    }
    return [...requirements, editingItem as RequirementItemDB]
  }

  const getPreviewProcedures = () => {
    if (!editingProcedure) return procedures
    if (editingProcedure.id) {
      return procedures.map((item) =>
        item.id === editingProcedure.id ? (editingProcedure as ProcedureStepDB) : item
      )
    }
    return [...procedures, editingProcedure as ProcedureStepDB]
  }

  const handleEditHeader = () => {
    setHeaderData(pageData)
    setEditingHeader(true)
  }

  const handleSaveHeader = async () => {
    if (!headerData || !headerData.title?.trim() || !headerData.enrollment_period?.trim() || !headerData.enrollment_dates?.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsSavingHeader(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerData),
      })

      const result = await response.json()
      if (response.ok) {
        setPageData(result.data || headerData)
        toast.success('Header updated successfully!')
        setEditingHeader(false)
        setHeaderData(null)
      } else {
        toast.error(result.error || 'Failed to save header')
      }
    } catch (error) {
      console.error('Error saving header:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingHeader(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Apply - Requirements
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
        Apply - Requirements & Enrollment Procedure
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {editingProcedure || (isEditing && editingItem) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Edit Form */}
            <div className="space-y-6">
              {editingProcedure ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Step Number
                    </label>
                    <input
                      type="number"
                      value={editingProcedure.step_number || 1}
                      onChange={(e) =>
                        setEditingProcedure({
                          ...editingProcedure,
                          step_number: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Step Description
                    </label>
                    <textarea
                      value={editingProcedure.description || ''}
                      onChange={(e) =>
                        setEditingProcedure({ ...editingProcedure, description: e.target.value })
                      }
                      rows={4}
                      placeholder="Enter step description..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Requirement Description
                    </label>
                    <textarea
                      value={editingItem?.description || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, description: e.target.value })
                      }
                      rows={4}
                      placeholder="Enter requirement description..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setEditingProcedure(null)
                    setIsEditing(false)
                  }}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProcedure ? handleSaveProcedure : handleSaveItem}
                  disabled={editingProcedure ? isSavingProcedure : isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProcedure ? (isSavingProcedure ? 'Saving...' : 'Save Step') : (isSaving ? 'Saving...' : 'Save Requirement')}
                </button>
              </div>
            </div>

            {/* Full Preview - Both Requirements and Procedures */}
            <div className="space-y-4">
              <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-gray-100 dark:border-gray-700 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Real-time View
                </span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 sticky top-14 max-h-[calc(100vh-250px)] overflow-y-auto shadow-sm">
                <ApplyRequirementsAndProcedure
                  title={pageData?.title}
                  enrollmentPeriod={pageData?.enrollment_period}
                  enrollmentDates={pageData?.enrollment_dates}
                  requirements={mapToPreviewItems(editingItem ? getPreviewItems() : requirements)}
                  procedures={mapToPreviewSteps(editingProcedure ? getPreviewProcedures() : procedures)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* Header Section */}
            {editingHeader && headerData ? (
              <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Page Header Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={headerData.title || ''}
                      onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Enrollment Period
                    </label>
                    <input
                      type="text"
                      value={headerData.enrollment_period || ''}
                      onChange={(e) => setHeaderData({ ...headerData, enrollment_period: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Enrollment Dates
                    </label>
                    <input
                      type="text"
                      value={headerData.enrollment_dates || ''}
                      onChange={(e) => setHeaderData({ ...headerData, enrollment_dates: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <button
                    onClick={() => { setEditingHeader(false); setHeaderData(null) }}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHeader}
                    disabled={isSavingHeader}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingHeader ? 'Saving...' : 'Update Header'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 dark:border-primary/30 rounded-lg">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Page Title</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{pageData?.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Enrollment Period</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{pageData?.enrollment_period}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Enrollment Dates</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{pageData?.enrollment_dates}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleEditHeader}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer"
                  >
                    Edit Header
                  </button>
                </div>
              </div>
            )}

            {/* Preview Section */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Layout Preview
                </h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-900">
                <ApplyRequirementsAndProcedure
                  title={editingHeader && headerData ? headerData.title : pageData?.title}
                  enrollmentPeriod={editingHeader && headerData ? headerData.enrollment_period : pageData?.enrollment_period}
                  enrollmentDates={editingHeader && headerData ? headerData.enrollment_dates : pageData?.enrollment_dates}
                  requirements={mapToPreviewItems(requirements)}
                  procedures={mapToPreviewSteps(procedures)}
                />
              </div>
            </div>

            {/* Manage Requirements Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Requirements
                </h2>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add Requirement
                </button>
              </div>
              <div className="space-y-3">
                {requirements.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition"
                  >
                    <p className="text-gray-900 dark:text-white flex-1 text-sm">
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {requirements.length === 0 && (
                  <p className="text-center py-8 text-gray-500 italic text-sm">
                    No requirements found. Create your first requirement!
                  </p>
                )}
              </div>
            </div>

            {/* Manage Enrollment Procedure Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Enrollment Procedure
                </h2>
                <button
                  onClick={handleAddProcedure}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add Step
                </button>
              </div>
              <div className="space-y-3">
                {procedures.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-bold text-primary text-lg w-8">
                        {item.step_number}.
                      </span>
                      <p className="text-gray-900 dark:text-white text-sm">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProcedure(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProcedure(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {procedures.length === 0 && (
                  <p className="text-center py-8 text-gray-500 italic text-sm">
                    No steps found. Create your first step!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
