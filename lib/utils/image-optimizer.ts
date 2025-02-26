export async function optimizeImage(file: File): Promise<File> {
  // Solo optimizar imágenes
  if (!file.type.startsWith("image/")) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo el aspect ratio
      let { width, height } = img
      const maxDimension = 1200

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      // Configurar canvas
      canvas.width = width
      canvas.height = height

      // Dibujar imagen optimizada
      ctx?.drawImage(img, 0, 0, width, height)

      // Convertir a WebP con calidad optimizada
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to optimize image"))
            return
          }
          resolve(new File([blob], file.name, { type: "image/webp" }))
        },
        "image/webp",
        0.85,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

