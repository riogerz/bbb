export interface FormSubmission {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: "pending" | "contacted" | "completed"
  createdAt: string
}

