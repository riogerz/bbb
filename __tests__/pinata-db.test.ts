import { describe, it, expect, beforeEach } from "@jest/globals"
import { pinataDB } from "@/lib/pinata-db"

describe("PinataDB Tests", () => {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
  }

  beforeEach(() => {
    pinataDB.clearCache()
  })

  it("should create a new record", async () => {
    const id = await pinataDB.create("users", testData)
    expect(id).toBeDefined()

    const record = await pinataDB.get(id)
    expect(record).toBeDefined()
    expect(record?.type).toBe("users")
    expect(record?.data.name).toBe(testData.name)
    // El email debe estar encriptado
    expect(record?.data.email).not.toBe(testData.email)
  })

  it("should find records by type", async () => {
    await pinataDB.create("users", testData)
    await pinataDB.create("users", { ...testData, name: "Another User" })

    const records = await pinataDB.find("users")
    expect(records.length).toBeGreaterThanOrEqual(2)
    expect(records[0].type).toBe("users")
  })

  it("should update a record", async () => {
    const id = await pinataDB.create("users", testData)
    const newName = "Updated User"

    await pinataDB.update(id, { name: newName })
    const record = await pinataDB.get(id)

    expect(record?.data.name).toBe(newName)
  })

  it("should delete a record", async () => {
    const id = await pinataDB.create("users", testData)
    await pinataDB.delete(id)

    const record = await pinataDB.get(id)
    expect(record).toBeNull()
  })

  it("should handle sensitive data encryption", async () => {
    const id = await pinataDB.create("users", testData)
    const record = await pinataDB.get(id)

    expect(record?.data.email).not.toBe(testData.email)
    expect(record?.data.phone).not.toBe(testData.phone)
  })

  it("should use cache for repeated reads", async () => {
    const id = await pinataDB.create("users", testData)

    // Primera lectura - desde IPFS
    const firstRead = await pinataDB.get(id)

    // Segunda lectura - debería venir del caché
    const secondRead = await pinataDB.get(id)

    expect(firstRead).toEqual(secondRead)
  })
})

