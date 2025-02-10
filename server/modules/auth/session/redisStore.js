// server/modules/auth/session/redisStore.js
import { createClient } from 'ioredis'
import connectRedis from 'connect-redis'
import session from 'express-session'

export const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000)
  }
})

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully')
})

export const RedisStore = connectRedis(session)
export const sessionStore = new RedisStore({ client: redisClient })