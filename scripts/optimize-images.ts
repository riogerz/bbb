import sharp from "sharp"
import { glob } from "glob"
import { promisify } from "util"
import { join } from "path"
import { readFile, writeFile, mkdir } from "fs/promises"

const globPromise = promisify(glob)

interface ImageStats {
  path: string
  originalSize: number
  optimizedSize: number
  savings: number
}

async function optimizeImage(inputPath: string, outputPath: string): Promise<ImageStats> {
  const input = await readFile(inputPath)
  const originalSize = input.length

  const optimized = await sharp(input).webp({ quality: 80, effort: 6 }).toBuffer()

  await mkdir(join(outputPath, ".."), { recursive: true })
  await writeFile(outputPath, optimized)

  return {
    path: inputPath,
    originalSize,
    optimizedSize: optimized.length,
    savings: ((originalSize - optimized.length) / originalSize) * 100,
  }
}

async function optimizeImages() {
  console.log("🖼️ Starting image optimization...")
  const startTime = Date.now()

  try {
    const publicDir = join(process.cwd(), "public")
    const outputDir = join(process.cwd(), "public/optimized")

    // Encontrar todas las imágenes
    const images = await globPromise("**/*.{jpg,jpeg,png}", { cwd: publicDir })

    console.log(`Found ${images.length} images to optimize`)

    const stats: ImageStats[] = []

    for (const image of images) {
      const inputPath = join(publicDir, image)
      const outputPath = join(outputDir, image.replace(/\.(jpg|jpeg|png)$/, ".webp"))

      try {
        const imageStats = await optimizeImage(inputPath, outputPath)
        stats.push(imageStats)

        console.log(
          `✅ Optimized ${image}: ${imageStats.savings.toFixed(2)}% reduction ` +
            `(${(imageStats.originalSize / 1024).toFixed(2)}KB → ${(imageStats.optimizedSize / 1024).toFixed(2)}KB)`,
        )
      } catch (error) {
        console.error(`❌ Error optimizing ${image}:`, error)
      }
    }

    // Calcular estadísticas totales
    const totalOriginal = stats.reduce((acc, stat) => acc + stat.originalSize, 0)
    const totalOptimized = stats.reduce((acc, stat) => acc + stat.optimizedSize, 0)
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100

    console.log("\n📊 Optimization Summary:")
    console.log("------------------------")
    console.log(`Total images processed: ${stats.length}`)
    console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`)
    console.log(`Optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`)
    console.log(`Total savings: ${totalSavings.toFixed(2)}%`)
    console.log(`Time taken: ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
  } catch (error) {
    console.error("Error during image optimization:", error)
    process.exit(1)
  }
}

optimizeImages()

