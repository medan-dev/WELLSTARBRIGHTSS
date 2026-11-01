import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = `${process.env.DATABASE_URL}`

declare global {
  var pgPool: undefined | Pool
  var prismaGlobal: undefined | PrismaClient
}

const pool = globalThis.pgPool ?? new Pool({ 
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
})

if (process.env.NODE_ENV !== 'production') globalThis.pgPool = pool

const adapter = new PrismaPg(pool)

const prisma = globalThis.prismaGlobal ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma
