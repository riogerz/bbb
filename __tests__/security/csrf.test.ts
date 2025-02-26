import { describe, test, expect } from "@jest/globals"
import { generateCSRFToken, validateCSRFToken } from "@/lib/utils/security"

describe("CSRF Protection Tests", () => {
  test("should generate valid CSRF tokens", () => {
    const token = generateCSRFToken()
    expect(token).toMatch(/^[a-f0-9]{64}$/i)
  })

  test("should validate CSRF tokens correctly", () => {
    const token = generateCSRFToken()

    // Token válido
    expect(validateCSRFToken(token, token)).toBe(true)

    // Token inválido
    expect(validateCSRFToken(token, "invalid-token")).toBe(false)
    expect(validateCSRFToken(token, "")).toBe(false)
    expect(validateCSRFToken(token, token.substring(1))).toBe(false)
  })

  test("should generate unique tokens", () => {
    const tokens = new Set()
    for (let i = 0; i < 1000; i++) {
      const token = generateCSRFToken()
      expect(tokens.has(token)).toBe(false)
      tokens.add(token)
    }
  })
})

