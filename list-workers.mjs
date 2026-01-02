import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const tomlPath = path.join(process.env.APPDATA || '', 'xdg.config', '.wrangler', 'config', 'default.toml')
const toml = fs.readFileSync(tomlPath, 'utf8')
const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/)
if (!tokenMatch) {
  console.error('Không tìm thấy OAuth token trong cấu hình Wrangler')
  process.exit(1)
}
const token = tokenMatch[1]

const whoami = execSync('wrangler whoami', { encoding: 'utf8' })
const idMatch = whoami.match(/[0-9a-f]{32}/i)
if (!idMatch) {
  console.error('Không lấy được Account ID từ wrangler whoami')
  process.exit(1)
}
const accountId = idMatch[0]

const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`, {
  headers: { Authorization: `Bearer ${token}` }
})
const data = await res.json()
if (!data.success || !Array.isArray(data.result)) {
  console.error(JSON.stringify(data))
  process.exit(1)
}
for (const s of data.result) {
  console.log(s.id)
}
