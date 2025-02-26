import { create, type IPFSHTTPClient } from "ipfs-http-client"
import { CID } from "multiformats/cid"
import { sha256 } from "multiformats/hashes/sha2"

interface IPFSNode {
  url: string
  gateway: string
  isHealthy: boolean
}

class DistributedIPFSClient {
  private nodes: IPFSNode[]
  private clients: Map<string, IPFSHTTPClient>
  private currentNodeIndex: number

  constructor() {
    // Lista de nodos IPFS distribuidos
    this.nodes = [
      {
        url: "https://ipfs.io/api/v0",
        gateway: "https://ipfs.io/ipfs/",
        isHealthy: true,
      },
      {
        url: "https://dweb.link/api/v0",
        gateway: "https://dweb.link/ipfs/",
        isHealthy: true,
      },
      {
        url: "https://gateway.pinata.cloud/api/v0",
        gateway: "https://gateway.pinata.cloud/ipfs/",
        isHealthy: true,
      },
    ]

    this.clients = new Map()
    this.currentNodeIndex = 0
    this.initializeClients()
  }

  private async initializeClients() {
    for (const node of this.nodes) {
      try {
        const client = create({ url: node.url })
        await client.version() // Verificar conexión
        this.clients.set(node.url, client)
      } catch (error) {
        console.error(`Failed to initialize IPFS client for ${node.url}:`, error)
        node.isHealthy = false
      }
    }
  }

  private getHealthyNode(): IPFSNode {
    const healthyNodes = this.nodes.filter((node) => node.isHealthy)
    if (healthyNodes.length === 0) {
      throw new Error("No healthy IPFS nodes available")
    }

    // Rotación simple de nodos
    this.currentNodeIndex = (this.currentNodeIndex + 1) % healthyNodes.length
    return healthyNodes[this.currentNodeIndex]
  }

  private async withRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
    let lastError: Error | undefined

    for (let i = 0; i < retries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${i + 1} failed:`, error)

        // Marcar el nodo actual como no saludable
        const currentNode = this.getHealthyNode()
        currentNode.isHealthy = false

        // Esperar antes del siguiente intento
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)))
      }
    }

    throw lastError || new Error("Operation failed after retries")
  }

  async add(data: Buffer | string): Promise<string> {
    return this.withRetry(async () => {
      const node = this.getHealthyNode()
      const client = this.clients.get(node.url)

      if (!client) {
        throw new Error(`No client available for node ${node.url}`)
      }

      // Calcular el hash antes de subir
      const hash = await sha256.digest(Buffer.from(data))
      const cid = CID.create(1, 0x12, hash)

      // Subir a IPFS con replicación
      const result = await client.add(data, {
        pin: true, // Pinear automáticamente
        wrapWithDirectory: false,
        timeout: 10000,
      })

      // Verificar que el CID coincida
      if (result.cid.toString() !== cid.toString()) {
        throw new Error("CID verification failed")
      }

      // Replicar en otros nodos
      await this.replicateAcrossNodes(result.cid.toString())

      return result.cid.toString()
    })
  }

  private async replicateAcrossNodes(cid: string) {
    const replicationPromises = this.nodes
      .filter((node) => node.isHealthy)
      .map(async (node) => {
        const client = this.clients.get(node.url)
        if (client) {
          try {
            await client.pin.add(CID.parse(cid))
          } catch (error) {
            console.error(`Failed to replicate to ${node.url}:`, error)
          }
        }
      })

    await Promise.allSettled(replicationPromises)
  }

  async get(cid: string): Promise<Buffer> {
    return this.withRetry(async () => {
      const node = this.getHealthyNode()
      const client = this.clients.get(node.url)

      if (!client) {
        throw new Error(`No client available for node ${node.url}`)
      }

      const chunks: Buffer[] = []
      for await (const chunk of client.cat(cid)) {
        chunks.push(Buffer.from(chunk))
      }

      return Buffer.concat(chunks)
    })
  }

  getGatewayUrl(cid: string): string[] {
    // Devolver URLs de todos los gateways saludables
    return this.nodes.filter((node) => node.isHealthy).map((node) => `${node.gateway}${cid}`)
  }

  async isAvailable(cid: string): Promise<boolean> {
    try {
      const node = this.getHealthyNode()
      const client = this.clients.get(node.url)

      if (!client) {
        return false
      }

      for await (const _ of client.pin.ls({ paths: [cid] })) {
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

export const ipfsClient = new DistributedIPFSClient()

