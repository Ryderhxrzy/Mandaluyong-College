import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key helpers
export const cacheKeys = {
  hero: 'home:hero',
  coreValues: 'home:coreValues',
  academicPrograms: 'home:academicPrograms',
}

// Cache TTL in seconds (1 hour)
export const CACHE_TTL = 3600
