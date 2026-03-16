'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import CourseDetails from '@/components/academics/programs/course/CourseDetails'

export interface CourseDetailsProps {
  id: string
  icon: string
  title: string
  description: string
  duration: string
  requiredStrand: string
  backgroundImage?: string
  isNew?: boolean
  status?: 'available' | 'coming-soon'
}

export default function RealtimeCourseDetailsWrapper() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('id')
  const [program, setProgram] = useState<CourseDetailsProps | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchProgram = useCallback(async () => {
    if (!courseId) {
      setError('No program ID provided')
      return
    }

    try {
      // Fetch from programs_featured_programs
      const response = await fetch(`/api/admin/programs/featured/${courseId}`)
      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched program data:', data)
        setProgram({
          id: data.id,
          icon: data.icon,
          title: data.title,
          description: data.description,
          duration: data.duration,
          requiredStrand: data.requiredStrand,
          backgroundImage: data.backgroundImage,
          status: data.status,
          isNew: data.isNew,
        })
        setError(null)
      } else {
        const errorData = await response.json()
        console.error('API error response:', errorData)
        setError('Program not found')
      }
    } catch (error) {
      console.error('Error fetching program:', error)
      setError('Failed to load program')
    }
  }, [courseId])

  const setupRealtimeSubscriptions = useCallback(() => {
    if (!courseId) return

    console.log('Setting up real-time subscriptions for course details...')

    // Subscribe to featured programs changes (program details)
    const programChannel = supabase
      .channel(`course_details_program_realtime_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_featured_programs' },
        async () => {
          console.log('Program change detected, refetching...')
          await fetchProgram()
        }
      )
      .subscribe((status) => {
        console.log('Program subscription status:', status)
      })

    // Subscribe to course_details_images changes
    const imagesChannel = supabase
      .channel(`course_details_images_realtime_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_details_images' },
        async () => {
          console.log('Course images change detected')
          // Images are fetched in CourseDetails component with real-time subscription
        }
      )
      .subscribe()

    // Subscribe to course_possible_careers changes
    const careersChannel = supabase
      .channel(`course_details_careers_realtime_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_possible_careers' },
        async () => {
          console.log('Course careers change detected')
          // Careers are fetched in CourseDetails component with real-time subscription
        }
      )
      .subscribe()

    // Subscribe to course_curriculum changes
    const curriculumChannel = supabase
      .channel(`course_details_curriculum_realtime_${courseId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_curriculum' },
        async () => {
          console.log('Course curriculum change detected')
          // Curriculum is fetched in CourseCurriculum component with real-time subscription
        }
      )
      .subscribe()

    return () => {
      console.log('Cleaning up course details subscriptions...')
      supabase.removeChannel(programChannel)
      supabase.removeChannel(imagesChannel)
      supabase.removeChannel(careersChannel)
      supabase.removeChannel(curriculumChannel)
    }
  }, [courseId, fetchProgram])

  useEffect(() => {
    fetchProgram()
    return setupRealtimeSubscriptions()
  }, [courseId, fetchProgram, setupRealtimeSubscriptions])

  // Show error page only if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 py-16">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} />
            Back to Programs
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Program Not Found
            </h1>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              {error}
            </p>
            <Link
              href="/programs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show page immediately with placeholder data while fetching
  // Only show actual program data once it's available
  const displayProgram: CourseDetailsProps = program || {
    id: courseId || '',
    icon: '',
    title: '',
    description: '',
    duration: '',
    requiredStrand: '',
  }

  return <CourseDetails program={displayProgram} courseId={courseId} />
}
