import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const raw = readFileSync(join(__dirname, 'data', 'users.json'), 'utf-8')
const users = JSON.parse(raw)
const emailIndex = new Map(users.map(u => [u.email.toLowerCase(), u]))

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json([...emailIndex.keys()])
}
