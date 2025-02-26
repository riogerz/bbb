import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Pricing() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Pricing</h2>
          <p className="mt-4 text-lg text-zinc-400">Transparent pricing for quality artwork</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="bg-zinc-900">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-zinc-400">{plan.unit}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Book Consultation</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const pricingPlans = [
  {
    name: "Small Tattoos",
    description: "Perfect for simple designs",
    price: "150",
    unit: "/hour",
    features: [
      "Size up to 4 inches",
      "Simple designs",
      "Black and grey or color",
      "Free consultation",
      "Aftercare kit included",
    ],
  },
  {
    name: "Medium Pieces",
    description: "Ideal for detailed work",
    price: "200",
    unit: "/hour",
    features: [
      "Size up to 8 inches",
      "Complex designs",
      "Custom artwork",
      "Multiple sessions if needed",
      "Priority booking",
    ],
  },
  {
    name: "Large Projects",
    description: "For extensive artwork",
    price: "250",
    unit: "/hour",
    features: [
      "Size 8+ inches",
      "Full sleeves/back pieces",
      "Multiple sessions",
      "VIP scheduling",
      "Complimentary touch-ups",
    ],
  },
]

