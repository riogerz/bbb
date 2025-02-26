import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturedTattoo() {
  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-3xl font-bold">Featured Work</h2>
        <Card className="overflow-hidden bg-zinc-900">
          <CardContent className="p-0">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-square">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                  <Image
                    src="/placeholder.svg"
                    alt="Featured tattoo artwork"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h3 className="mb-4 text-2xl font-semibold">Geometric Abstraction</h3>
                <p className="mb-6 text-zinc-300">
                  This striking piece blends realism with geometric abstraction, creating a unique portrait that
                  challenges traditional tattoo aesthetics. The fragmented face, intersected by bold shapes and lines,
                  represents the complexity of human identity in the modern world.
                </p>
                <div className="mb-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-zinc-200">Style</h4>
                    <p className="text-sm text-zinc-400">Contemporary Abstract Realism</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-200">Technique</h4>
                    <p className="text-sm text-zinc-400">
                      Black and grey with strong contrast, detailed stippling, and precise linework
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-200">Placement</h4>
                    <p className="text-sm text-zinc-400">Upper thigh</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-200">Session Time</h4>
                    <p className="text-sm text-zinc-400">Approximately 5-6 hours</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-black hover:bg-zinc-200">Book Similar Design</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

