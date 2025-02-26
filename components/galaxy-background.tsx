"use client"

export function GalaxyBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backdropFilter: "blur(24px) saturate(120%)",
        WebkitBackdropFilter: "blur(24px) saturate(120%)",
        background: `
          linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)),
          url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2852-ddqPKmP02wZSGUnjZDbL3afzQQpjEx.jpeg') center/cover fixed
        `,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        mixBlendMode: "normal",
      }}
    />
  )
}

