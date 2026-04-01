import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const raw = readFileSync(join(__dirname, 'data', 'users.json'), 'utf-8')
const users = JSON.parse(raw)
const emailIndex = new Map(users.map(u => [u.email.toLowerCase(), u]))

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { email } = req.query
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' })
  }

  const user = emailIndex.get(email.toLowerCase().trim())
  if (!user) {
    return res.status(404).json({ error: 'No results found for this email' })
  }

  res.status(200).json({
    email: user.email,
    name: user.name,
    platforms: user.platforms,
  })
}
