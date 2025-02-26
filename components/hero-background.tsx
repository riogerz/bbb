import Image from "next/image"

export function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-20">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2853.JPG-RnwAhTMZ9LsmwnZNPfCF9sBAbiDvbd.jpeg"
        alt="Background tattoo design"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}

