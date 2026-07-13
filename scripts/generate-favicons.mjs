import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const publicDir = path.join(root, 'public')
const source = path.join(publicDir, 'neurodiver-app-icon-source.png')

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }
const BLACK_THRESHOLD = 40

/** Remove near-black JPEG padding so favicons can use transparency. */
async function withTransparentBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
}

async function resizeIcon(pipeline, size) {
  return pipeline
    .clone()
    .resize(size, size, { fit: 'contain', background: TRANSPARENT })
    .png()
}

const transparentBase = await withTransparentBackground(source)
const trimmedBuffer = await transparentBase.trim().png().toBuffer()
const icon = sharp(trimmedBuffer)

const outputs = [
  { file: 'favicon-16.png', size: 16 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'neurodiver-icon.png', size: 512 },
]

for (const { file, size } of outputs) {
  await (await resizeIcon(icon, size)).toFile(path.join(publicDir, file))
}

const icoSizes = [16, 32, 48]
const icoBuffers = await Promise.all(
  icoSizes.map(async (size) => (await resizeIcon(icon, size)).toBuffer()),
)
await fs.writeFile(path.join(publicDir, 'favicon.ico'), await toIco(icoBuffers))

console.log('Favicons generated from neurodiver-app-icon-source.png')
