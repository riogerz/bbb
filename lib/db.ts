// Este es un archivo de base de datos simulado para desarrollo
// En producción, usaríamos una base de datos real como PostgreSQL, MongoDB, etc.

// Simulación de una base de datos en memoria
class MockDatabase {
  private data: Record<string, any[]> = {
    users: [],
    messages: [],
    submissions: [],
  }

  async query(table: string) {
    return {
      findMany: async (options?: any) => {
        return this.data[table] || []
      },
      findFirst: async (options?: any) => {
        return (this.data[table] || [])[0] || null
      },
      create: async (options?: any) => {
        const newItem = { id: Date.now().toString(), ...options.data }
        if (!this.data[table]) this.data[table] = []
        this.data[table].push(newItem)
        return newItem
      },
      update: async (options?: any) => {
        if (!this.data[table]) return null
        const index = this.data[table].findIndex((item) => item.id === options.where.id)
        if (index === -1) return null
        this.data[table][index] = { ...this.data[table][index], ...options.data }
        return this.data[table][index]
      },
      delete: async (options?: any) => {
        if (!this.data[table]) return null
        const index = this.data[table].findIndex((item) => item.id === options.where.id)
        if (index === -1) return null
        const deleted = this.data[table][index]
        this.data[table].splice(index, 1)
        return deleted
      },
    }
  }
}

// Exportar la instancia de la base de datos
export const db = new MockDatabase()

