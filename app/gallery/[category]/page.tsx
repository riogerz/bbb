import { Suspense } from "react"
import { notFound } from "next/navigation"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { GallerySkeleton } from "@/components/gallery/gallery-skeleton"
import { getGalleryImages } from "@/lib/gallery"
import type { Metadata } from "next"

interface PageProps {
  params: {
    category: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = params.category.replace(/-/g, " ")

  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Gallery`,
    description: `View our collection of ${category} tattoo designs and artwork`,
  }
}

export async function generateStaticParams() {
  return [{ category: "black-and-grey" }, { category: "color" }, { category: "traditional" }, { category: "custom" }]
}

export default async function GalleryCategoryPage({ params }: PageProps) {
  const category = params.category.replace(/-/g, " ")
  const images = await getGalleryImages(category)

  if (!images.length) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold capitalize">{category} Gallery</h1>
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryGrid images={images} />
      </Suspense>
    </div>
  )
}

