import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BookingForm } from "@/components/booking-form"
import { RecentSubmissions } from "@/components/admin/recent-submissions"

describe("Component Integration Tests", () => {
  it("should submit booking form and store in PinataDB", async () => {
    render(<BookingForm />)

    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Test User" },
    })
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText(/phone/i), {
      target: { value: "+1234567890" },
    })
    fireEvent.change(screen.getByPlaceholderText(/tattoo idea/i), {
      target: { value: "Test message" },
    })

    // Enviar el formulario
    fireEvent.click(screen.getByText(/submit request/i))

    // Verificar que se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })

  it("should load and display recent submissions", async () => {
    render(<RecentSubmissions />)

    // Verificar que se carguen las submissions
    await waitFor(() => {
      const submissions = screen.getAllByRole("listitem")
      expect(submissions.length).toBeGreaterThan(0)
    })
  })
})

