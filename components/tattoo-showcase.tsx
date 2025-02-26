import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TattooShowcase() {
  const designElements = [
    {
      id: 1,
      title: "Astronaut",
      description: "Detailed spacesuit with intricate texturing and shading",
    },
    {
      id: 2,
      title: "Wings",
      description: "Symmetrical wings symbolizing freedom and transcendence",
    },
    {
      id: 3,
      title: "Eye",
      description: "Mystical eye representing cosmic consciousness",
    },
    {
      id: 4,
      title: "Triangle",
      description: "Sacred geometry framing the composition",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden bg-zinc-900 p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1864-zjjzkgI6JBr9BE5D21odnAweiLA2mg.jpeg"
                  alt="Astronaut tattoo with wings and eye"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {designElements.map((element) => (
                    <TooltipProvider key={element.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <div className="h-4 w-4 rounded-full border-2 border-white bg-black/50 transition-transform duration-300 hover:scale-150" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{element.title}</p>
                            <p className="text-sm text-zinc-300">{element.description}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="mb-2 text-2xl font-bold">Cosmic Voyager</h1>
                <p className="text-zinc-400">
                  A surreal piece combining space exploration with mystical symbolism. This design merges precise
                  linework with detailed stippling and shading techniques to create a powerful narrative about human
                  exploration and spiritual ascension.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Technical Details</h2>
                <div className="grid gap-4 text-sm">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <h3 className="mb-2 font-medium">Technique</h3>
                    <p className="text-zinc-400">
                      Black and grey realism with geometric elements, combining stipple shading for texture and clean
                      linework for definition.
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <h3 className="mb-2 font-medium">Size & Duration</h3>
                    <p className="text-zinc-400">
                      Medium-sized piece, approximately 6-7 inches in height. Typically requires 4-5 hours to complete
                      in a single session.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">Book Similar Design</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

