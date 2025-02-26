import { minify } from "terser"
import { readFile, writeFile } from "fs/promises"
import * as glob from "glob"

interface FileStats {
  path: string
  originalSize: number
  optimizedSize: number
  savings: number
}

const TERSER_CONFIG = {
  compress: {
    arrows: true,
    arguments: true,
    booleans_as_integers: true,
    booleans: true,
    collapse_vars: true,
    comparisons: true,
    computed_props: true,
    conditionals: true,
    dead_code: true,
    directives: true,
    drop_console: true,
    drop_debugger: true,
    evaluate: true,
    expression: true,
    global_defs: {},
    hoist_funs: true,
    hoist_props: true,
    hoist_vars: false,
    if_return: true,
    inline: true,
    join_vars: true,
    keep_classnames: false,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: false,
    loops: true,
    module: true,
    negate_iife: true,
    passes: 3,
    properties: true,
    pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"],
    pure_getters: "strict",
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: true,
    toplevel: true,
    typeofs: true,
    unsafe: false,
    unsafe_arrows: false,
    unsafe_comps: false,
    unsafe_Function: false,
    unsafe_math: false,
    unsafe_methods: false,
    unsafe_proto: false,
    unsafe_regexp: false,
    unsafe_undefined: false,
    unused: true,
  },
  mangle: {
    eval: true,
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    toplevel: true,
    safari10: true,
    properties: {
      regex: /^_/,
    },
  },
  format: {
    ascii_only: true,
    braces: true,
    comments: false,
    ecma: 2020,
    indent_level: 0,
    indent_start: 0,
    inline_script: true,
    keep_numbers: false,
    keep_quoted_props: false,
    max_line_len: false,
    preamble: null,
    quote_keys: false,
    quote_style: 0,
    semicolons: true,
    shebang: true,
    webkit: true,
    wrap_iife: false,
  },
  sourceMap: false,
  ecma: 2020,
  keep_classnames: false,
  keep_fnames: false,
  ie8: false,
  module: true,
  nameCache: null,
  safari10: true,
  toplevel: true,
}

async function findFiles(dir: string, pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: dir, absolute: true }, (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}

async function optimizeFile(filePath: string): Promise<FileStats> {
  const content = await readFile(filePath, "utf8")
  const originalSize = Buffer.from(content).length

  try {
    const result = await minify(content, TERSER_CONFIG)

    if (result.code) {
      await writeFile(filePath, result.code)
      const optimizedSize = Buffer.from(result.code).length
      const savings = ((originalSize - optimizedSize) / originalSize) * 100

      return {
        path: filePath,
        originalSize,
        optimizedSize,
        savings,
      }
    }
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error)
  }

  return {
    path: filePath,
    originalSize,
    optimizedSize: originalSize,
    savings: 0,
  }
}

async function optimizeDirectory(dir: string): Promise<FileStats[]> {
  const stats: FileStats[] = []

  // Encontrar todos los archivos JS/TS
  const patterns = [
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/dist/**",
    "!**/build/**",
  ]

  for (const pattern of patterns) {
    const files = await findFiles(dir, pattern)

    for (const file of files) {
      const fileStat = await optimizeFile(file)
      stats.push(fileStat)

      // Mostrar progreso
      console.log(
        `Optimized ${file}: ${(fileStat.savings).toFixed(2)}% reduction ` +
          `(${(fileStat.originalSize / 1024).toFixed(2)}KB → ${(fileStat.optimizedSize / 1024).toFixed(2)}KB)`,
      )
    }
  }

  return stats
}

async function main() {
  console.log("🚀 Starting code optimization...")

  const startTime = Date.now()
  const projectRoot = process.cwd()

  try {
    const stats = await optimizeDirectory(projectRoot)

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

    // Identificar archivos con mayor ahorro
    const topSavings = [...stats].sort((a, b) => b.savings - a.savings).slice(0, 5)

    console.log("\n🏆 Top 5 Optimized Files:")
    console.log("------------------------")
    topSavings.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.path}: ${stat.savings.toFixed(2)}% reduction`)
    })
  } catch (error) {
    console.error("❌ Error during optimization:", error)
    process.exit(1)
  }
}

main()

