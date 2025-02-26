"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, X } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { href: "#", label: "Home" },
    { href: "#gallery", label: "Gallery" },
    { href: "#about", label: "About" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-black p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <span className="text-lg font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex h-12 items-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4">
              <Button className="w-full bg-white text-black hover:bg-gray-200">Book Now</Button>
            </div>
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} NYC TATTOO</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

