'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface CourseImage {
  image: string
}

export default function CourseImagesPageContent() {
  const searchParams = useSearchParams()
  const programId = searchParams.get('program')
  const [images, setImages] = useState<string[]>([])
  const [programTitle, setProgramTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!programId) return

      try {
        // Fetch program info
        const programResponse = await fetch(`/api/admin/programs/featured/${programId}`)
        if (programResponse.ok) {
          const programData = await programResponse.json()
          setProgramTitle(programData.title || programData.course_title)
        }

        // Fetch images
        const imagesResponse = await fetch(`/api/course-details/images/${programId}`)
        if (imagesResponse.ok) {
          const imageData = await imagesResponse.json()
          setImages(Array.isArray(imageData) ? imageData : [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load course images')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [programId])

  const handleUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setImages([...images, imageUrl])
      toast.success('Image added successfully')
    }
  }

  const handleDeleteImage = async (index: number) => {
    if (!confirm('Delete this image?')) return

    setIsSaving(true)
    try {
      const newImages = images.filter((_, i) => i !== index)
      const response = await fetch(`/api/admin/course-details/images/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: newImages }),
      })

      if (response.ok) {
        setImages(newImages)
        toast.success('Image removed')
      } else {
        toast.error('Failed to remove image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Error removing image')
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Images</h1>
        <p className="text-gray-600 dark:text-gray-400">{programTitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        {/* Images Grid */}
        {images.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
                    <Image
                      src={image}
                      alt={`Course image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteImage(index)}
                    disabled={isSaving}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">Image {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Image</h2>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleUpload}
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                className="w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex flex-col items-center justify-center gap-3 transition cursor-pointer"
              >
                <Upload size={32} />
                <div className="text-center">
                  <p className="font-medium">Click to upload image</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </button>
            )}
          </CldUploadWidget>
        </div>

        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No images added yet. Upload your first image above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
