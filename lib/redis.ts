import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key helpers
export const cacheKeys = {
  // Home page
  hero: 'home:hero',
  coreValues: 'home:coreValues',
  academicPrograms: 'home:academicPrograms',
  overview: 'home:overview',
  // About page
  banner: 'about:banner',
  keyStatistics: 'about:keyStatistics',
  whyChoose: 'about:whyChoose',
  goals: 'about:goals',
  philosophy: 'about:philosophy',
  missionVision: 'about:missionVision',
  coreValuesSection: 'about:coreValuesSection',
  joinCommunity: 'about:joinCommunity',
  // Course details
  courseImages: (courseId: string) => `course:${courseId}:images`,
  courseCareers: (courseId: string) => `course:${courseId}:careers`,
  courseCareerSection: (courseId: string) => `course:${courseId}:career-section`,
  courseCurriculum: (courseId: string) => `course:${courseId}:curriculum`,
}

// Cache TTL in seconds (1 hour)
export const CACHE_TTL = 3600
