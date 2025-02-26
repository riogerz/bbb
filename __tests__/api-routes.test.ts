import { describe, it, expect } from "@jest/globals"
import { createMocks } from "node-mocks-http"
import { POST } from "@/app/api/db/create/route"
import { GET } from "@/app/api/db/[id]/route"
import { GET as FindRecords } from "@/app/api/db/find/route"

describe("API Routes Tests", () => {
  const testData = {
    type: "submissions",
    data: {
      name: "Test Submission",
      email: "test@example.com",
      message: "Test message",
    },
  }

  it("should create a new record via API", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: testData,
    })

    await POST(req)
    const data = await res._getJSONData()

    expect(res._getStatusCode()).toBe(200)
    expect(data.success).toBe(true)
    expect(data.id).toBeDefined()
  })

  it("should get a record via API", async () => {
    // Primero creamos un registro
    const { req: createReq, res: createRes } = createMocks({
      method: "POST",
      body: testData,
    })
    await POST(createReq)
    const createData = await createRes._getJSONData()
    const id = createData.id

    // Luego intentamos obtenerlo
    const { req, res } = createMocks({
      method: "GET",
      params: { id },
    })

    await GET(req, { params: { id } })
    const data = await res._getJSONData()

    expect(res._getStatusCode()).toBe(200)
    expect(data.success).toBe(true)
    expect(data.record.type).toBe(testData.type)
  })

  it("should find records via API", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/api/db/find?type=submissions",
    })

    await FindRecords(req)
    const data = await res._getJSONData()

    expect(res._getStatusCode()).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.records)).toBe(true)
  })
})

