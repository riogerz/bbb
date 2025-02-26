import type { GalleryImage, SocialLink, FAQItem } from "@/types"

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2854.JPG-UHbpnfOkKEBz1qImG4Y4yeJnljOpcH.jpeg",
    alt: "Hyper-realistic black and grey portrait tattoo of Jack Nicholson from The Shining showing dual expressions capturing the character's descent into madness",
    priority: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2855.JPG-SeXgWtidRVbJF0IqaybDHv1nolbPYu.jpeg",
    alt: "Geometric portrait tattoo with abstract elements and striking eyes, featuring angular segments and precise shading",
    priority: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0371-BPdQv30l1cUjcTclfpLqeaSkcpaSof.jpeg",
    alt: "Black and grey bird tattoo with detailed feather work captured in dynamic flight pose",
    priority: true,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1864-2HVX4W9FUq7ahDTm5MJYhhmJlv1K1B.jpeg",
    alt: "Surreal astronaut tattoo combining cosmic elements with mystical symbolism and geometric patterns",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2852-qDORrtRggk3nunrWyVMOxfYM07r8eF.jpeg",
    alt: "Portrait tattoo with intricate floral elements and silhouette scene, blending realism with decorative art",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6279-rygZWSMzvvXojiyoXsmiXxn9fOXifO.jpeg",
    alt: "Sacred heart tattoo with all-seeing eye and radiating lines in black and grey",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6761-2gvhbou631rdblRriyUPZ3arOBXL98.jpeg",
    alt: "Geometric style raccoon portrait tattoo with realistic details and abstract patterns",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5033-I5HtPZq0pbkn0T8fRdktRshn4XT2Py.jpeg",
    alt: "Abstract geometric sleeve tattoo with dynamic shapes and precise dot shading",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8208-lAWpA358io6Buh76sH5Hp8BhqmT4Pg.jpeg",
    alt: "Stylized jellyfish tattoo with flowing tentacles and strong contrast",
  },
] as const

// Rest of the constants remain unchanged
export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How to Prepare for Your Tattoo Session?",
    answer:
      "Get plenty of rest, stay hydrated, and avoid alcohol before your appointment. Eat a good meal and wear comfortable clothing that allows easy access to the area being tattooed.",
  },
  {
    question: "How long does it take to get a tattoo?",
    answer:
      "Session length varies depending on the size and complexity of your design. Small pieces might take 1-2 hours, while larger pieces could require multiple sessions.",
  },
] as const

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/riogerzz",
    icon: "Instagram",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/riogerz",
    icon: "Twitter",
  },
  {
    name: "Rodeo",
    url: "https://rodeo.club/@riogerz/posts",
    icon: "Ticket",
  },
] as const

