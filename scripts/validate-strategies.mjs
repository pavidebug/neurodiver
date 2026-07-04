#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateCatalog, CatalogValidationError } from './lib/validate-catalog.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CATALOG_PATH = path.join(__dirname, '../data/strategies.catalog.json')

const raw = await readFile(CATALOG_PATH, 'utf8')

try {
  const catalog = validateCatalog(JSON.parse(raw))
  console.log(`Valid catalog: ${catalog.strategies.length} strategies`)
} catch (error) {
  if (error instanceof CatalogValidationError) {
    console.error(`Invalid catalog: ${error.message}`)
    process.exit(1)
  }
  throw error
}
