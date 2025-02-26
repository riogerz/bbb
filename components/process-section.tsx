import { CheckCircle2, Paintbrush, Syringe, Heart } from "lucide-react"

export function ProcessSection() {
  return (
    <section className="bg-zinc-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our Process</h2>
          <p className="mt-4 text-lg text-zinc-400">
            From concept to completion, we ensure a professional and comfortable experience
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-orange-500/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Consultation",
    description: "Meet with our artists to discuss your vision, placement, and size. We'll help you refine your ideas.",
    icon: CheckCircle2,
  },
  {
    title: "Design",
    description:
      "Our artists will create a custom design based on your ideas, with revisions until you're completely satisfied.",
    icon: Paintbrush,
  },
  {
    title: "Tattooing",
    description: "Get your tattoo in our clean, professional studio using top-quality equipment and inks.",
    icon: Syringe,
  },
  {
    title: "Aftercare",
    description: "Receive detailed aftercare instructions and follow-up support to ensure proper healing.",
    icon: Heart,
  },
]

