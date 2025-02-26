import type { FAQItem } from "@/types"

const faqItems: FAQItem[] = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can book an appointment through our online booking system, or by contacting us directly via email or phone. We'll discuss your ideas and schedule a consultation.",
  },
  {
    question: "How much does a tattoo cost?",
    answer:
      "Tattoo prices vary depending on size, complexity, and time required. We'll provide a detailed quote during your consultation.",
  },
  {
    question: "What should I do to prepare for my tattoo?",
    answer:
      "Get a good night's sleep, eat before your appointment, and stay hydrated. Avoid alcohol and blood thinners for 24 hours before your session.",
  },
  {
    question: "Do you do custom designs?",
    answer:
      "Yes! We specialize in custom designs and work closely with each client to create unique pieces that match their vision.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl space-y-8">
          {faqItems.map((item, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-xl font-semibold">{item.question}</h3>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

