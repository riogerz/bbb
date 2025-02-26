import { hashPassword } from "@/lib/crypto/scrypt"

async function main() {
  const password = process.argv[2]

  if (!password) {
    console.error("Please provide a password")
    process.exit(1)
  }

  try {
    const hash = await hashPassword(password)
    console.log("Password hash:", hash)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()

