import type { GalleryImage } from "@/types"

export async function getGalleryImages(category: string): Promise<GalleryImage[]> {
  // En un caso real, esto vendría de una API o base de datos
  const allImages: Record<string, GalleryImage[]> = {
    "black and grey": [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1864-zjjzkgI6JBr9BE5D21odnAweiLA2mg.jpeg",
        alt: "Black and grey astronaut tattoo with intricate details",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC07712.JPG-27VU7rwPcQIVpyxZr446SzNayXsFCV.jpeg",
        alt: "Black and grey portrait tattoo with geometric elements",
      },
    ],
    color: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2852-hYH4fq8qPsp8uisCNyubyZbYhNaiYK.jpeg",
        alt: "Colorful traditional style tattoo",
      },
    ],
  }

  return allImages[category] || []
}

