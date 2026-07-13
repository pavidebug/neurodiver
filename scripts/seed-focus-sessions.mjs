#!/usr/bin/env node

/**
 * Seed Firestore focusSessions collection from data/focus-sessions.catalog.json
 *
 * Usage:
 *   npm run seed:focus-sessions
 *   npm run seed:focus-sessions -- --dry-run
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applicationDefault, initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'
import { resolveFirebaseProjectId } from './lib/resolve-firebase-project.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CATALOG_PATH = path.join(ROOT, 'data/focus-sessions.catalog.json')
const isDryRun = process.argv.includes('--dry-run')

function initFirestore(projectId) {
  if (getApps().length > 0) {
    return getFirestore()
  }

  if (!projectId) {
    throw new Error(
      'Unable to detect Firebase project ID. Set FIREBASE_PROJECT_ID, add VITE_FIREBASE_PROJECT_ID to .env.local, or configure .firebaserc.',
    )
  }

  initializeApp({
    projectId,
    credential: applicationDefault(),
  })

  return getFirestore()
}

async function readCatalog() {
  const raw = await readFile(CATALOG_PATH, 'utf8')
  const catalog = JSON.parse(raw)

  if (!Array.isArray(catalog.sessions)) {
    throw new Error('focus-sessions.catalog.json must include a sessions array')
  }

  return catalog
}

async function uploadCatalog(catalog, projectId) {
  const db = initFirestore(projectId)
  const catalogIds = new Set(catalog.sessions.map((session) => session.id))
  let written = 0
  let deactivated = 0

  for (const session of catalog.sessions) {
    const { id, startsAt, ...rest } = session

    if (!id || !startsAt) {
      throw new Error('Each session requires id and startsAt')
    }

    const payload = {
      ...rest,
      startsAt: Timestamp.fromDate(new Date(startsAt)),
      integrations: {
        googleCalendarEventId: null,
        outlookCalendarEventId: null,
        emailReminderEnabled: false,
        whatsappReminderEnabled: false,
      },
      catalogVersion: catalog.version,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }

    if (isDryRun) {
      console.log(`[dry-run] focusSessions/${id}`, payload)
      written++
      continue
    }

    await db.collection('focusSessions').doc(id).set(payload, { merge: true })
    written++
  }

  const existingSnap = await db.collection('focusSessions').get()

  for (const document of existingSnap.docs) {
    if (catalogIds.has(document.id)) continue

    const data = document.data()
    if (data.isActive === false) continue

    if (isDryRun) {
      console.log(`[dry-run] deactivate focusSessions/${document.id}`)
      deactivated++
      continue
    }

    await document.ref.set(
      {
        isActive: false,
        catalogVersion: catalog.version,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    deactivated++
  }

  return { written, deactivated }
}

async function main() {
  const projectId = await resolveFirebaseProjectId(ROOT)
  const catalog = await readCatalog()
  const result = await uploadCatalog(catalog, projectId)

  console.log(
    isDryRun
      ? `Dry run complete — ${result.written} focus sessions validated.`
      : `Seeded ${result.written} focus sessions to focusSessions (${result.deactivated} deactivated).`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
