import { minify } from "terser"
import { readFile, writeFile } from "fs/promises"
import { glob } from "glob"
import { promisify } from "util"
import { join } from "path"

const globPromise = promisify(glob)

interface JSStats {
  path: string
  originalSize: number
  optimizedSize: number
  savings: number
}

const TERSER_CONFIG = {
  compress: {
    dead_code: true,
    drop_console: true,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: false,
    keep_fnames: false,
    passes: 3,
  },
  mangle: {
    eval: true,
    keep_classnames: false,
    keep_fnames: false,
    toplevel: true,
    safari10: true,
  },
  format: {
    comments: false,
    ascii_only: true,
  },
}

async function optimizeJS() {
  console.log("🚀 Starting JavaScript optimization...")
  const startTime = Date.now()

  try {
    const buildDir = join(process.cwd(), ".next/static")
    const jsFiles = await globPromise("**/*.js", { cwd: buildDir })

    console.log(`Found ${jsFiles.length} JavaScript files to optimize`)

    const stats: JSStats[] = []

    for (const file of jsFiles) {
      const filePath = join(buildDir, file)
      const content = await readFile(filePath, "utf8")
      const originalSize = Buffer.from(content).length

      try {
        const result = await minify(content, TERSER_CONFIG)

        if (result.code) {
          await writeFile(filePath, result.code)
          const optimizedSize = Buffer.from(result.code).length

          stats.push({
            path: file,
            originalSize,
            optimizedSize,
            savings: ((originalSize - optimizedSize) / originalSize) * 100,
          })

          console.log(
            `✅ Optimized ${file}: ${(((originalSize - optimizedSize) / originalSize) * 100).toFixed(2)}% reduction`,
          )
        }
      } catch (error) {
        console.error(`❌ Error optimizing ${file}:`, error)
      }
    }

    // Calcular estadísticas totales
    const totalOriginal = stats.reduce((acc, stat) => acc + stat.originalSize, 0)
    const totalOptimized = stats.reduce((acc, stat) => acc + stat.optimizedSize, 0)
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100

    console.log("\n📊 Optimization Summary:")
    console.log("------------------------")
    console.log(`Total files processed: ${stats.length}`)
    console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`)
    console.log(`Optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`)
    console.log(`Total savings: ${totalSavings.toFixed(2)}%`)
    console.log(`Time taken: ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
  } catch (error) {
    console.error("Error during JavaScript optimization:", error)
    process.exit(1)
  }
}

optimizeJS()

