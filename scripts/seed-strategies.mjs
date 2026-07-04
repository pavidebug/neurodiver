#!/usr/bin/env node

/**
 * Seed Firestore strategies collection from data/strategies.catalog.json
 *
 * Requirements:
 *   - Project id from .firebaserc, .env.local (VITE_FIREBASE_PROJECT_ID), or FIREBASE_PROJECT_ID
 *   - Auth via GOOGLE_APPLICATION_CREDENTIALS (service account JSON), or
 *     gcloud auth application-default login
 *
 * Usage:
 *   npm run seed:strategies
 *   npm run seed:strategies -- --dry-run
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applicationDefault, initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { validateCatalog, CatalogValidationError } from './lib/validate-catalog.mjs'
import { normalizeStrategyForFirestore } from './lib/normalize-strategy.mjs'
import { resolveFirebaseProjectId } from './lib/resolve-firebase-project.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CATALOG_PATH = path.join(ROOT, 'data/strategies.catalog.json')
const BATCH_SIZE = 400
const isDryRun = process.argv.includes('--dry-run')

async function readCatalog() {
  const raw = await readFile(CATALOG_PATH, 'utf8')
  const catalog = JSON.parse(raw)
  return validateCatalog(catalog)
}

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

async function uploadCatalog(catalog, projectId) {
  const db = initFirestore(projectId)
  const normalized = catalog.strategies.map(normalizeStrategyForFirestore)
  const active = normalized.filter((strategy) => strategy.isActive)
  let written = 0

  for (let i = 0; i < normalized.length; i += BATCH_SIZE) {
    const chunk = normalized.slice(i, i + BATCH_SIZE)
    const batch = db.batch()

    for (const entry of chunk) {
      const { id, ...payload } = entry
      const ref = db.collection('strategies').doc(id)

      batch.set(
        ref,
        {
          ...payload,
          catalogVersion: catalog.version,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
      written++
    }

    if (!isDryRun) {
      await batch.commit()
    }
  }

  return { written, active: active.length, total: normalized.length }
}

async function main() {
  console.log(`Reading catalog from ${CATALOG_PATH}`)

  let catalog

  try {
    catalog = await readCatalog()
  } catch (error) {
    if (error instanceof CatalogValidationError) {
      console.error(`Catalog validation failed: ${error.message}`)
      process.exit(1)
    }
    throw error
  }

  console.log(`Catalog "${catalog.catalogName}" v${catalog.version} (${catalog.updatedAt})`)
  console.log(`Found ${catalog.strategies.length} strategies`)

  if (catalog.strategies.length === 0) {
    console.log('Nothing to upload. Add entries to data/strategies.catalog.json first.')
    process.exit(0)
  }

  if (isDryRun) {
    console.log('Dry run — validation passed. No documents written.')
    catalog.strategies.forEach((strategy, index) => {
      const normalized = normalizeStrategyForFirestore(strategy, index)
      console.log(`  • ${strategy.id} (order ${normalized.order}) — ${strategy.title}`)
    })
    process.exit(0)
  }

  const projectId = await resolveFirebaseProjectId(ROOT)
  console.log(`Firebase project: ${projectId ?? '(not found)'}`)

  const result = await uploadCatalog(catalog, projectId)

  console.log(`Uploaded ${result.written} documents to Firestore collection "strategies"`)
  console.log(`${result.active} active strategies will appear in the app`)
}

main().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
