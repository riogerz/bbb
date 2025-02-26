import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"

export function MainNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          RIO ARTIST
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link href="#gallery" className="text-sm hover:text-gray-300">
            Gallery
          </Link>
          <Link href="#about" className="text-sm hover:text-gray-300">
            About
          </Link>
          <Link href="#faq" className="text-sm hover:text-gray-300">
            FAQ
          </Link>
          <Link href="#contact" className="text-sm hover:text-gray-300">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="hidden bg-white text-black hover:bg-gray-200 md:inline-flex">Book Now</Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

