import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Client Stories</h2>
          <p className="mt-4 text-lg text-zinc-400">Hear what our clients have to say about their experience</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-zinc-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex text-orange-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-zinc-400">{testimonial.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: "Alex Thompson",
    avatar: "/placeholder.svg",
    comment:
      "Incredible attention to detail and amazing artistic vision. The whole process was smooth and professional.",
  },
  {
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    comment:
      "They took my ideas and transformed them into something better than I could have imagined. Highly recommend!",
  },
  {
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg",
    comment:
      "The studio is clean, the artists are skilled, and the atmosphere is welcoming. Couldn't be happier with my tattoo.",
  },
]

