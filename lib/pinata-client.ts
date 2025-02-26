interface PinataConfig {
  apiKey: string
  apiSecret: string
  jwt: string
  gateway: string
}

export class PinataClient {
  private jwt: string
  private gateway: string

  constructor() {
    // Usar variables de entorno directamente
    this.jwt = process.env.PINATA_JWT || ""
    this.gateway = process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud"
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `https://api.pinata.cloud${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.jwt}`,
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`)
    }

    return response.json()
  }

  async uploadFile(
    file: File,
    metadata: Record<string, any> = {},
  ): Promise<{
    IpfsHash: string
    PinSize: number
    Timestamp: string
  }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: file.name,
        keyvalues: metadata,
      }),
    )

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error uploading to Pinata")
    }

    return response.json()
  }

  async listFiles(filters: Record<string, string> = {}): Promise<any[]> {
    const queryParams = new URLSearchParams(filters).toString()
    const data = await this.request(`/data/pinList?${queryParams}`)
    return data.rows
  }

  async deleteFile(hash: string): Promise<void> {
    await this.request(`/pinning/unpin/${hash}`, { method: "DELETE" })
  }

  getFileUrl(hash: string): string {
    return `${this.gateway}/ipfs/${hash}`
  }
}

// Exportar una instancia singleton
export const pinataClient = new PinataClient()

