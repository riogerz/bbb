"use client"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ScrollBackdrop } from "@/components/scroll-backdrop"
import { HeroBackground } from "@/components/hero-background"
import { Instagram, Ticket, Twitter, ChevronDown } from "lucide-react"
import { Lightbox } from "@/components/lightbox"
import { GallerySection } from "@/components/gallery-section"
import { ContactForm } from "@/components/contact-form"
import { RepeatingBanner } from "@/components/repeating-banner"
import { GALLERY_IMAGES, SOCIAL_LINKS } from "@/utils/constants"
import { useLightbox } from "@/context/lightbox-context"
import { GalaxyBackground } from "./galaxy-background"
import Image from "next/image"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function HomePage() {
  const { openLightbox } = useLightbox()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGalleryClick = (index: number) => {
    const displayImages = GALLERY_IMAGES.slice(0, 9)
    openLightbox(index, displayImages)
  }

  const [showFullBio, setShowFullBio] = useState(false)

  const handleContactSubmit = async (data: any) => {
    if (isSubmitting) return false
    setIsSubmitting(true)

    try {
      toast({
        title: "Enviando...",
        description: "Procesando tu solicitud",
      })

      // Demo mode - Simulate successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
        duration: 5000,
      })

      return true
    } catch (error) {
      console.error("Error:", error)

      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar tu solicitud. Por favor, intenta nuevamente.",
        duration: 5000,
      })

      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      <HeroBackground />
      <ScrollBackdrop />
      <MainNav />

      {/* Hero Section */}
      <section className="relative h-screen" aria-label="Hero">
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">NYC TATTOO</h1>
            <p className="mb-6 text-lg text-gray-200">"Talk ink stories."</p>
            <Button
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => {
                const contactForm = document.getElementById("contact")
                contactForm?.scrollIntoView({ behavior: "smooth" })
              }}
              aria-label="Book a tattoo appointment"
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>

      <div className="bg-black">
        {/* Artist Bio */}
        <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="bio-heading">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2810.JPG-zcBxdNkBtJEoIlWepDiTgRUZ7f4n83.jpeg"
                alt="Professional black and white portrait of Rioger Martinez wearing a black beanie and turtleneck"
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoadingComplete={(img) => {
                  img.classList.remove("opacity-0")
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 id="bio-heading" className="mb-4 text-2xl font-bold">
                Rioger Martinez
              </h2>
              <p className="mb-6 text-gray-300">
                {showFullBio ? (
                  <>
                    Rioger Martinez was born on October 2, 1991 in Havana, Cuba. From a very young age, he nurtured a
                    passionate interest in the visual arts. At the age of 7, he took his first steps as an artist in a
                    small school, and then at 16 he embraced the San Alejandro National Academy of Fine Arts. From the
                    vibrant streets of Cuba at the age of 25 he moved to Russia where he experimented and evolved his
                    art for 6 years in the city of Moscow. His mastery extended to drawing, photography, digital art and
                    design, but his true artistic soul found a home in painting. Through his paintings, RIO weaves a
                    call to self-acceptance, urging us to embrace our flaws as unique jewels and treasure every
                    advantage they give us. But where does his fascination with tattoos come from? It was in adolescence
                    that he found his true passion, immersing himself in a constantly evolving universe. After finishing
                    fine art school, he realized that tattoos could provide a permanent and personal form of artistic
                    expression. Over the years, he has honed his skills and developed a distinctive style that fuses
                    intricate detail and captivating compositions. To nurture his creativity, he participated in
                    workshops, conventions and Biennales while maintaining constant contact with other prominent tattoo
                    artists. His unmistakable style shines through in his mastery of grayscale realism, blending surreal
                    and abstract elements that bring timeless and evocative tattoos to life. This unique style creates
                    beautiful realistic tattoos and intriguing black cubism masterpieces. When he&apos;s not wielding a
                    needle, you&apos;ll find him drawing or painting
                  </>
                ) : (
                  "Rioger Martinez was born on October 2, 1991 in Havana, Cuba. From a very young age, he nurtured a passionate interest in the visual arts. Master tattoo artist with over a decade of experience, his journey from the San Alejandro National Academy of Fine Arts to becoming a renowned tattoo artist reflects his dedication to artistic excellence..."
                )}
              </p>
              <Button
                onClick={() => setShowFullBio(!showFullBio)}
                className="w-fit bg-white text-black hover:bg-gray-200"
                aria-label={showFullBio ? "Show less about Rioger Martinez" : "Read more about Rioger Martinez"}
              >
                {showFullBio ? "Show Less" : "Read More"}
              </Button>
            </div>
          </div>
        </section>

        {/* Rest of the sections remain unchanged */}
        <GallerySection images={GALLERY_IMAGES} onImageClick={handleGalleryClick} />
        <RepeatingBanner text="Remember that a tattoo is forever" />

        {/* Information Cards */}
        <section className="relative px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="info-heading">
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2853.JPG-RnwAhTMZ9LsmwnZNPfCF9sBAbiDvbd.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-md" />
          <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 relative">
            <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
              <h3 id="info-heading" className="mb-4 text-xl font-bold text-white">
                Pricing Information
              </h3>
              <p className="mb-6 text-white/90">
                Keep in mind that the hourly rate for custom work is $400. Upon completion of the consultation and
                project planning, a deposit will be required to reserve an appointment for the day of the tattoo. This
                deposit is non-refundable and will be deducted from the final price of the tattoo
              </p>
              <Button
                className="bg-white text-black hover:bg-gray-200"
                aria-label="View more information about our services"
              >
                More Information
              </Button>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
              <h3 className="mb-4 text-xl font-bold text-white">Studio Hours</h3>
              <div className="mb-6 space-y-2 text-white/90">
                <p>Monday - Friday: 11:00 AM - 8:00 PM</p>
                <p>Saturday: 12:00 PM - 6:00 PM</p>
                <p>Sunday: By Appointment Only</p>
              </div>
              <Button className="bg-white text-black hover:bg-gray-200" aria-label="Schedule an appointment">
                Book Appointment
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8" id="faq" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-heading" className="mb-8 text-center text-2xl font-bold">
              Frequently Asked Questions About Your Tattoo Journey
            </h2>
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById("faq-answer-0")
                    if (element) {
                      const isExpanded = element.classList.contains("hidden")
                      element.classList.toggle("hidden")
                      element.previousElementSibling?.querySelector(".chevron")?.classList.toggle("rotate-180")
                    }
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold">How to Prepare for Your Tattoo Session?</h3>
                  <ChevronDown className="chevron h-5 w-5 shrink-0 transition-transform duration-200" />
                </button>
                <div id="faq-answer-0" className="hidden mt-4">
                  <p className="text-gray-400">
                    Don't drink the night before. Alcohol thins the blood, making it harder for the artist to work, the
                    ink to stay in, and for you to heal. Do your best to avoid any unnecessary blood-thinning
                    medications before your session (unless you have a medical condition, of course). Have a good meal
                    before your appointment. Skipping a meal can lead to dizziness and more discomfort than usual,
                    sometimes even causing you to faint or experience severe nausea. During longer sessions, both the
                    artist and client usually take a lunch break to refuel. Otherwise, come in a relaxed state. Some
                    people like to bring something to read or keep themselves occupied when possible
                  </p>
                </div>
              </div>

              <div className="border-b border-white/10 pb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById("faq-answer-1")
                    if (element) {
                      const isExpanded = element.classList.contains("hidden")
                      element.classList.toggle("hidden")
                      element.previousElementSibling?.querySelector(".chevron")?.classList.toggle("rotate-180")
                    }
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold">How long does it take to get a tattoo?</h3>
                  <ChevronDown className="chevron h-5 w-5 shrink-0 transition-transform duration-200" />
                </button>
                <div id="faq-answer-1" className="hidden mt-4">
                  <p className="text-gray-400">
                    Getting a tattoo is a process that requires patience and shouldn't be rushed, as it's a permanent
                    choice. Small tattoos can sometimes take a while due to the precise details or simplicity you're
                    aiming for. On the other hand, larger tattoos demand a significant time investment, though this
                    again varies depending on the design style. For instance, a full sleeve will take more than one
                    session to complete, but there's no fixed number or established timeframe for each tattoo. The
                    necessary time is taken to ensure it turns out perfect. This artistic process has no shortcuts, only
                    dedication to both the details and the final result you desire
                  </p>
                </div>
              </div>

              <div className="border-b border-white/10 pb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById("faq-answer-2")
                    if (element) {
                      const isExpanded = element.classList.contains("hidden")
                      element.classList.toggle("hidden")
                      element.previousElementSibling?.querySelector(".chevron")?.classList.toggle("rotate-180")
                    }
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold">
                    If I'm feeling sick, should I still go to my tattoo appointment?
                  </h3>
                  <ChevronDown className="chevron h-5 w-5 shrink-0 transition-transform duration-200" />
                </button>
                <div id="faq-answer-2" className="hidden mt-4">
                  <p className="text-gray-400">
                    Getting a tattoo when your immune system isn't at its best isn't advisable. If your immune system is
                    already working to fight off an illness, adding the aftercare process and a new tattoo can further
                    stress your current immunity. Reach out to reschedule your appointment by giving me a call or
                    sending an email. Remember, taking care of your health is essential. Postpone your tattoo session to
                    a time when you're feeling your best and can fully enjoy the experience and the beautiful art we'll
                    create together. Your well-being is a priority, and I look forward to working with you when you're
                    in optimal health.
                  </p>
                </div>
              </div>

              <div className="border-b border-white/10 pb-8">
                <button
                  onClick={() => {
                    const element = document.getElementById("faq-answer-3")
                    if (element) {
                      const isExpanded = element.classList.contains("hidden")
                      element.classList.toggle("hidden")
                      element.previousElementSibling?.querySelector(".chevron")?.classList.toggle("rotate-180")
                    }
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold">Are your tattoo inks safe and high-quality?</h3>
                  <ChevronDown className="chevron h-5 w-5 shrink-0 transition-transform duration-200" />
                </button>
                <div id="faq-answer-3" className="hidden mt-4">
                  <p className="text-gray-400">
                    I assure safety and excellence in each tattoo I craft. I collaborate with well-regarded brands such
                    as Intenze and Dynamic for inks, and Kawadron and Cheyenne for needles. The Cheyenne Sol Nova
                    Unlimited tattoo machine I employ ensures remarkable outcomes in every design. Your safety and
                    contentment are my utmost concern
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section
          className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <GalaxyBackground />
          <div
            className="relative z-10 mx-auto max-w-xl rounded-lg p-8 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
              backdropFilter: "blur(12px) saturate(180%)",
              WebkitBackdropFilter: "blur(12px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: `
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `,
            }}
          >
            <div className="mb-8 text-center">
              <h2 id="contact-heading" className="text-2xl font-bold text-white">
                Contact Us
              </h2>
              <p className="mt-2 text-gray-400">
                Fill out the form below to inquire about your tattoo. We'll get back to you soon.
              </p>
            </div>
            <ContactForm onSubmit={handleContactSubmit} />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 px-4 py-8 text-center" role="contentinfo">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex justify-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label={link.name}
                >
                  {link.icon === "Instagram" && <Instagram className="h-5 w-5" aria-hidden="true" />}
                  {link.icon === "Twitter" && <Twitter className="h-5 w-5" aria-hidden="true" />}
                  {link.icon === "Ticket" && <Ticket className="h-5 w-5" aria-hidden="true" />}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} NYC TATTOO. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <Lightbox />
      </div>
    </main>
  )
}

