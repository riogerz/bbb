export interface FleekFile {
  key: string
  hash: string
  size: number
  mimeType: string
  created: string
  url: string
}

class FleekClient {
  async uploadFile(file: File, folder?: string): Promise<FleekFile> {
    const formData = new FormData()
    formData.append("file", file)
    if (folder) {
      formData.append("folder", folder)
    }

    const response = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error uploading file")
    }

    return response.json()
  }

  async deleteFile(key: string): Promise<void> {
    const response = await fetch("/api/storage/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    })

    if (!response.ok) {
      throw new Error("Error deleting file")
    }
  }

  async listFiles(prefix?: string): Promise<FleekFile[]> {
    const url = new URL("/api/storage/list", window.location.origin)
    if (prefix) {
      url.searchParams.set("prefix", prefix)
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Error listing files")
    }

    const data = await response.json()
    return data.files
  }
}

export const fleekClient = new FleekClient()

