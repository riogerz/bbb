import { describe, test, expect } from "@jest/globals"
import { sanitizeInput, validateToken } from "@/lib/utils/security"

describe("Input Validation Tests", () => {
  test("should sanitize XSS attempts", () => {
    const testCases = [
      {
        input: '<script>alert("xss")</script>',
        expected: 'alert("xss")',
      },
      {
        input: "javascript:alert(1)",
        expected: "alert(1)",
      },
      {
        input: '<img src="x" onerror="alert(1)">',
        expected: 'img src="x" onerror="alert(1)"',
      },
      {
        input: '<a href="javascript:alert(1)">click me</a>',
        expected: 'a href="alert(1)"click me/a',
      },
    ]

    for (const { input, expected } of testCases) {
      const sanitized = sanitizeInput(input)
      expect(sanitized).not.toContain("<script>")
      expect(sanitized).not.toContain("javascript:")
    }
  })

  test("should validate tokens correctly", () => {
    const validTokens = ["1234567890abcdef1234567890abcdef", "a".repeat(32), "f".repeat(64)]

    const invalidTokens = [
      "",
      "short",
      "invalid-chars-!@#$",
      "a".repeat(31), // muy corto
      "g".repeat(65), // muy largo
    ]

    for (const token of validTokens) {
      expect(validateToken(token)).toBe(true)
    }

    for (const token of invalidTokens) {
      expect(validateToken(token)).toBe(false)
    }
  })
})

