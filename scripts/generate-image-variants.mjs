// Generates responsive AVIF variants for every photo in public/photos.
// Run with: npm run generate:images
//
// Produces "<name>-<width>.avif" for each target width (skipping widths
// larger than the source to avoid upscaling). Source files are left
// untouched. Re-running is safe — existing source files are reprocessed,
// previously generated variants are skipped.

import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, parse } from 'path'

const SRC_DIR = join(process.cwd(), 'public', 'photos')
const WIDTHS = [400, 600, 1080, 1600]
const QUALITY = 65

const variantPattern = /-(?:400|600|1080|1600)\.avif$/i
const sourcePattern = /\.(avif|jpe?g|png)$/i

const files = readdirSync(SRC_DIR).filter(
  (f) => sourcePattern.test(f) && !variantPattern.test(f),
)

for (const file of files) {
  const srcPath = join(SRC_DIR, file)
  const { name } = parse(file)
  const meta = await sharp(srcPath).metadata()

  for (const width of WIDTHS) {
    if (meta.width && meta.width <= width) continue // never upscale

    const outPath = join(SRC_DIR, `${name}-${width}.avif`)
    await sharp(srcPath)
      .resize({ width })
      .avif({ quality: QUALITY, effort: 4 })
      .toFile(outPath)

    const { size } = statSync(outPath)
    console.log(`${name}-${width}.avif  ${(size / 1024).toFixed(1)} KiB`)
  }
}
