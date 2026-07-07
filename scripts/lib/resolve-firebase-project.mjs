import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function loadEnvLocal(root) {
  if (typeof root !== 'string' || root.trim().length === 0) {
    throw new Error(
      'loadEnvLocal requires a project root directory path. Received: ' +
        String(root),
    )
  }

  const envPath = path.join(root, '.env.local')

  try {
    const raw = await readFile(envPath, 'utf8')

    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim()

      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  } catch {
    // .env.local is optional for scripts
  }
}

export async function resolveFirebaseProjectId(root) {
  if (typeof root !== 'string' || root.trim().length === 0) {
    throw new Error(
      'resolveFirebaseProjectId requires a project root directory path. Received: ' +
        String(root),
    )
  }

  await loadEnvLocal(root)

  if (process.env.FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID
  }

  if (process.env.VITE_FIREBASE_PROJECT_ID) {
    return process.env.VITE_FIREBASE_PROJECT_ID
  }

  try {
    const firebasercPath = path.join(root, '.firebaserc')
    const firebaserc = JSON.parse(await readFile(firebasercPath, 'utf8'))
    const projectId = firebaserc.projects?.default

    if (typeof projectId === 'string' && projectId.length > 0) {
      return projectId
    }
  } catch {
    // fall through
  }

  return null
}
