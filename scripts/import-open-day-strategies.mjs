import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const SPREADSHEET_ID = '1Xt3cneN-0oac-ikN4LD5K-w_SZNMu_GQzvjlSJ08hm0'
const SHEET_GID = '1842401785'
const OUTPUT_PATH = resolve('src/data/open-day-strategies.ts')
const CSV_URL =
  `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`

function parseCsv(input) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const next = input[index + 1]

    if (quoted) {
      if (character === '"' && next === '"') {
        value += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        value += character
      }
      continue
    }

    if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(value)
      value = ''
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''))
      rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ''))
    rows.push(row)
  }

  return rows
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/^[\s"]+|[\s"]+$/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

function splitSteps(value) {
  const text = cleanText(value)
  if (!text) return []

  const numbered = text
    .split(/\n\s*\n|\n(?=\s*\d+[.)]\s+)/)
    .map((step) => cleanText(step).replace(/^\d+[.)]\s*/, '').trim())
    .filter(Boolean)

  return numbered.length > 0 ? numbered : [text]
}

function mapCategory(label) {
  const normalized = cleanText(label).toLowerCase()
  if (normalized === 'social') return 'Social & Communication'
  if (normalized === 'wellness') return 'Energy & Burnout'
  return 'Executive Function'
}

function makeId(label, rowNumber, usedIds) {
  const base =
    cleanText(label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `strategy-${rowNumber}`

  let id = base
  let suffix = 2
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  usedIds.add(id)
  return id
}

function getLetteredVariant(label) {
  const match = cleanText(label).match(/^(.*?)\s*\(([A-Z])\)\s*$/i)
  if (!match) return null

  return {
    base: match[1]
      .toLowerCase()
      .replace(/\s*-\s*/g, '-')
      .replace(/\s+/g, ' ')
      .trim(),
    letter: match[2].toUpperCase(),
  }
}

const response = await fetch(CSV_URL)
if (!response.ok) {
  throw new Error(`Unable to download strategy sheet (${response.status}).`)
}

const rows = parseCsv(await response.text())
const [headers, ...dataRows] = rows
const headerIndex = Object.fromEntries(headers.map((header, index) => [cleanText(header), index]))
const variantLettersByBase = new Map()
for (const row of dataRows) {
  const variant = getLetteredVariant(row[headerIndex.Category])
  if (!variant) continue

  const letters = variantLettersByBase.get(variant.base) ?? new Set()
  letters.add(variant.letter)
  variantLettersByBase.set(variant.base, letters)
}

const filteredRows = dataRows.filter((row) => {
  const variant = getLetteredVariant(row[headerIndex.Category])
  if (!variant) return true

  const letters = variantLettersByBase.get(variant.base)
  const isMultiVariantGroup = Boolean(letters?.has('A') && letters.size > 1)
  return !isMultiVariantGroup || variant.letter === 'A'
})

function buildStrategies(rowsToMap) {
  const usedIds = new Set()

  return rowsToMap.flatMap((row, dataIndex) => {
  const rowNumber = dataIndex + 2
  const sheetCategory = cleanText(row[headerIndex.Category])
  const challenge = cleanText(row[headerIndex['Situation Description']])
  const monologue = cleanText(row[headerIndex['First-Person Monologue']])
  const actions = cleanText(row[headerIndex.Actions])
  const whyItWorks = cleanText(row[headerIndex['Details (Why It Works)']])
  const appHeading = cleanText(row[headerIndex['App Card Heading']])
  const source = cleanText(row[headerIndex.Source])
  const situation = monologue || challenge
  const steps = splitSteps(actions)

  if (!sheetCategory || !situation || steps.length === 0) return []

  const id = makeId(sheetCategory, rowNumber, usedIds)
  const category = mapCategory(sheetCategory)
  const title = appHeading || `${category} strategy ${dataIndex + 1}`
  const tags = [
    sheetCategory.replace(/\s*-\s*\d+.*$/i, '').toLowerCase(),
    category.toLowerCase(),
    ...`${challenge} ${situation}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 5)
      .slice(0, 12),
  ]

  return [{
    id,
    title,
    category,
    challenge: challenge || situation,
    situation,
    internalThoughts: monologue || situation,
    gentleReminder: '',
    whatsHappening: challenge,
    tryThis: steps,
    whyThisHelps: whyItWorks,
    expectedOutcome: '',
    estimatedTime: '',
    timerEnabled: false,
    energyRequired: 'Low',
    difficulty: 'Easy',
    bestWhen: ['Running Low', 'Steady', 'Recovery Needed'],
    tags: [...new Set(tags)],
    relatedStrategies: [],
    evidenceLevel: 'Community-informed',
    source,
    status: 'Published',
    order: dataIndex + 1,
    isActive: true,
    description: challenge || situation,
    tip: steps[0],
    recommendedFor: ['running-low', 'steady', 'recovery-needed'],
  }]
  })
}

const allStrategies = buildStrategies(dataRows)
const strategies = buildStrategies(filteredRows)

const file = `import type { Strategy } from '@/types/strategy'

/**
 * Generated from the read-only Google Sheet "Strategies (V2)".
 * Run \`node scripts/import-open-day-strategies.mjs\` to refresh this catalog.
 */
export const OPEN_DAY_STRATEGIES_ALL = ${JSON.stringify(allStrategies, null, 2)} satisfies Strategy[]

export const OPEN_DAY_STRATEGIES = ${JSON.stringify(strategies, null, 2)} satisfies Strategy[]

export const OPEN_DAY_PRIMARY_STRATEGY_IDS = new Set(
  OPEN_DAY_STRATEGIES.map((strategy) => strategy.id),
)
`

await writeFile(OUTPUT_PATH, file)
console.log(
  `Imported ${strategies.length} Open Day strategies to ${OUTPUT_PATH} ` +
  `(${dataRows.length - filteredRows.length} alternate variants removed).`,
)
