import { readFile } from "fs/promises"
import { join } from "path"
import { gzipSize } from "gzip-size"
import prettyBytes from "pretty-bytes"
import { glob } from "glob"
import { promisify } from "util"
import brotliSize from "brotli-size"

const globPromise = promisify(glob)

interface BundleStats {
  file: string
  originalSize: number
  gzippedSize: number
  brotliSize: number
}

async function analyzeBundleSize() {
  console.log("📦 Starting bundle analysis...")
  const startTime = Date.now()

  try {
    const buildDir = join(process.cwd(), ".next/static")
    const jsFiles = await globPromise("**/*.js", { cwd: buildDir })

    console.log(`Found ${jsFiles.length} files to analyze`)

    const stats: BundleStats[] = []

    for (const file of jsFiles) {
      const filePath = join(buildDir, file)
      const content = await readFile(filePath)

      const stat: BundleStats = {
        file,
        originalSize: content.length,
        gzippedSize: await gzipSize(content),
        brotliSize: await brotliSize.sync(content),
      }

      stats.push(stat)

      console.log(`\n📄 ${file}:`)
      console.log(`  Raw size:    ${prettyBytes(stat.originalSize)}`)
      console.log(`  Gzipped:     ${prettyBytes(stat.gzippedSize)}`)
      console.log(`  Brotli:      ${prettyBytes(stat.brotliSize)}`)
    }

    // Calcular totales
    const totals = stats.reduce(
      (acc, stat) => ({
        originalSize: acc.originalSize + stat.originalSize,
        gzippedSize: acc.gzippedSize + stat.gzippedSize,
        brotliSize: acc.brotliSize + stat.brotliSize,
      }),
      { originalSize: 0, gzippedSize: 0, brotliSize: 0 },
    )

    console.log("\n📊 Bundle Size Summary:")
    console.log("------------------------")
    console.log(`Total files: ${stats.length}`)
    console.log(`Raw size:    ${prettyBytes(totals.originalSize)}`)
    console.log(`Gzipped:     ${prettyBytes(totals.gzippedSize)}`)
    console.log(`Brotli:      ${prettyBytes(totals.brotliSize)}`)
    console.log(`Time taken:  ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
  } catch (error) {
    console.error("Error analyzing bundle:", error)
    process.exit(1)
  }
}

analyzeBundleSize()

