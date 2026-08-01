import { neon } from '@neondatabase/serverless'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) {
    console.error('signup: no database connection string configured')
    res.status(500).json({ error: 'Signup storage is not configured yet.' })
    return
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' })
    return
  }

  try {
    const sql = neon(connectionString)
    await sql`CREATE TABLE IF NOT EXISTS signups (
      email TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`
    await sql`INSERT INTO signups (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('signup error', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
