import { execFileSync } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const pdfPath =
  process.argv[2] ??
  '/Users/pavi2cool4u/Downloads/Coping_Strategies_Print_Imposition_V2.pdf'
const outputDirectory = resolve('public/open-day-v3')
const temporaryDirectory = resolve('tmp/pdfs/open-day-v3-hires')
const renderPrefix = resolve(temporaryDirectory, 'page')

const FRONT_PAGES = new Map([
  [1, ['work-01-a', 'work-01-b', 'work-02-a', 'work-02-b', 'work-02-c', 'work-02-d', 'work-03-a', 'work-04-a', 'work-05-a']],
  [3, ['work-06-a', 'work-06-b', 'work-07-a', 'work-08-a', 'work-08-b', 'work-09-a', 'work-10-a', 'work-11-a', 'work-12-a']],
  [5, ['work-12-b', 'work-12-c', 'work-12-d', 'work-13-a', 'work-14-a', 'work-14-b', 'work-15-a', 'work-16-a', 'work-16-b']],
  [7, ['work-16-c', 'work-17-a', 'work-17-b', 'work-18-a', 'work-18-b', 'work-18-c', 'work-19-a', 'work-20-a', 'work-21-a']],
  [9, ['work-21-b', 'work-22-a', 'work-23-a', 'work-24-a', 'work-24-b', 'work-25-a', 'work-27-a', 'work-28-a', 'work-29-a']],
])

await rm(temporaryDirectory, { recursive: true, force: true })
await mkdir(temporaryDirectory, { recursive: true })
await mkdir(outputDirectory, { recursive: true })

execFileSync('pdftoppm', [
  '-png',
  '-r',
  '180',
  '-f',
  '1',
  '-l',
  '9',
  pdfPath,
  renderPrefix,
])

let extracted = 0
for (const [pageNumber, codes] of FRONT_PAGES) {
  const renderedPage = `${renderPrefix}-${String(pageNumber).padStart(2, '0')}.png`
  const metadata = await sharp(renderedPage).metadata()
  const pageWidth = metadata.width
  const pageHeight = metadata.height
  if (!pageWidth || !pageHeight) throw new Error(`Could not read page ${pageNumber}.`)

  const cellWidth = pageWidth / 3
  const cellHeight = pageHeight / 3

  for (const [index, code] of codes.entries()) {
    if (!code.endsWith('-a')) continue

    const column = index % 3
    const row = Math.floor(index / 3)
    const left = Math.round(column * cellWidth + cellWidth * 0.085)
    const top = Math.round(row * cellHeight + cellHeight * 0.145)
    const width = Math.round(cellWidth * 0.83)
    const height = Math.round(cellHeight * 0.44)

    await sharp(renderedPage)
      .extract({ left, top, width, height })
      .webp({ quality: 90 })
      .toFile(resolve(outputDirectory, `${code}.webp`))
    extracted += 1
  }
}

await rm(temporaryDirectory, { recursive: true, force: true })
console.log(`Extracted ${extracted} V3 card illustrations to ${outputDirectory}.`)
