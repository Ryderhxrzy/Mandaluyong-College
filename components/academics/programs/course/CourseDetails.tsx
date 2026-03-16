'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import CourseDetailsBanner from './CourseDetailsBanner'
import CourseDetailsImages from './CourseDetailsImages'
import PossibleCareers from './PossibleCareers'
import CourseCurriculum from './CourseCurriculum'

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

interface CareerData {
  career_title: string
  career_description: string
}

interface SectionContent {
  section_title?: string
  section_sub_title?: string
  section_description?: string
}

export default function CourseDetails({ program, courseId }: { program: CourseDetailsProps; courseId: string | null }) {
  const [images, setImages] = useState<string[]>([])
  const [careers, setCareers] = useState<CareerData[]>([])
  const [sectionContent, setSectionContent] = useState<SectionContent | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return

      try {
        // Fetch course images
        const imagesResponse = await fetch(`/api/course-details/images/${courseId}`)
        if (imagesResponse.ok) {
          const imageData = await imagesResponse.json()
          // imageData is now an array of image URLs
          if (Array.isArray(imageData) && imageData.length > 0) {
            setImages(imageData)
          }
        }

        // Fetch possible careers
        const careersResponse = await fetch(`/api/course-details/careers/${courseId}`)
        if (careersResponse.ok) {
          const careersList = await careersResponse.json()
          setCareers(careersList)
        }

        // Fetch section content
        const sectionResponse = await fetch(`/api/admin/course-details/careers-section?courseId=${courseId}`)
        if (sectionResponse.ok) {
          const section = await sectionResponse.json()
          setSectionContent(section)
        }
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    }

    fetchCourseData()

    if (!courseId) return

    // Subscribe to real-time changes for careers
    const careersSubscription = supabase
      .channel(`course_careers_realtime_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_possible_careers',
        },
        async () => {
          // Refetch careers when any change occurs
          try {
            const careersResponse = await fetch(`/api/course-details/careers/${courseId}`)
            if (careersResponse.ok) {
              const careersList = await careersResponse.json()
              setCareers(careersList)
            }
          } catch (error) {
            console.error('Error refetching careers:', error)
          }
        }
      )
      .subscribe()

    // Subscribe to real-time changes for section content
    const sectionSubscription = supabase
      .channel(`course_section_realtime_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_possible_careers_section',
        },
        async () => {
          // Refetch section when any change occurs
          try {
            const sectionResponse = await fetch(`/api/admin/course-details/careers-section?courseId=${courseId}`)
            if (sectionResponse.ok) {
              const section = await sectionResponse.json()
              setSectionContent(section)
            }
          } catch (error) {
            console.error('Error refetching section:', error)
          }
        }
      )
      .subscribe()

    // Subscribe to real-time changes for images
    const imagesSubscription = supabase
      .channel(`course_images_realtime_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_details_images',
        },
        async () => {
          // Refetch images when any change occurs
          try {
            const imagesResponse = await fetch(`/api/course-details/images/${courseId}`)
            if (imagesResponse.ok) {
              const imageData = await imagesResponse.json()
              setImages(Array.isArray(imageData) ? imageData : [])
            }
          } catch (error) {
            console.error('Error refetching images:', error)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(careersSubscription)
      supabase.removeChannel(sectionSubscription)
      supabase.removeChannel(imagesSubscription)
    }
  }, [courseId])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Banner Section */}
      <CourseDetailsBanner courseName={program.title} />

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-16 md:py-24">
        {/* Images Section */}
        <CourseDetailsImages images={images} />
      </div>

      {/* Possible Careers Section */}
      <PossibleCareers careers={careers} sectionContent={sectionContent || undefined} />

      {/* Course Curriculum Section */}
      <CourseCurriculum courseId={courseId} />
    </div>
  )
}
