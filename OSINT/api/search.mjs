import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

let emailIndex = null

async function loadData() {
  if (emailIndex) return emailIndex
  const raw = await readFile(join(__dirname, 'data', 'users.json'), 'utf-8')
  const users = JSON.parse(raw)
  emailIndex = new Map()
  for (const user of users) {
    emailIndex.set(user.email.toLowerCase(), user)
  }
  return emailIndex
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const email = (req.query.email || '').toLowerCase().trim()

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' })
  }

  const index = await loadData()
  const user = index.get(email)

  if (!user) {
    return res.status(404).json({ error: 'No results found for this email' })
  }

  return res.status(200).json({
    email: user.email,
    name: user.name,
    platforms: user.platforms,
  })
}
