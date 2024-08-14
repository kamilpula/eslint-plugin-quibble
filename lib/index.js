import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const base = join(__dirname, `/rules/`)
const baseUrl = pathToFileURL(base).href

export default {
  rules: {
    foo: await import(`${baseUrl}foo.js`),
  },
}
