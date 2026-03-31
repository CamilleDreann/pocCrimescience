import Fastify from 'fastify'
import cors from '@fastify/cors'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const fastify = Fastify({ logger: true })

await fastify.register(cors, { origin: true })

// Load data into memory at startup
const raw = await readFile(join(__dirname, 'data', 'users.json'), 'utf-8')
const users = JSON.parse(raw)

// Build an index by email for O(1) lookup
const emailIndex = new Map()
for (const user of users) {
  emailIndex.set(user.email.toLowerCase(), user)
}

// Search endpoint
fastify.get('/api/search', {
  schema: {
    querystring: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string' },
      },
    },
  },
}, async (request, reply) => {
  const email = request.query.email.toLowerCase().trim()

  if (!email) {
    return reply.code(400).send({ error: 'Email parameter is required' })
  }

  const user = emailIndex.get(email)

  if (!user) {
    return reply.code(404).send({ error: 'No results found for this email' })
  }

  return {
    email: user.email,
    name: user.name,
    platforms: user.platforms,
  }
})

// Users list endpoint (for autocomplete)
fastify.get('/api/users', async (_request, reply) => {
  return reply.send([...emailIndex.keys()])
})

// Start
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
