"use server"

import { fleekService } from "@/lib/server/fleek-service"
import { revalidatePath } from "next/cache"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string | undefined

    if (!file) {
      throw new Error("No file provided")
    }

    const uploadedFile = await fleekService.uploadFile(file, folder)
    revalidatePath("/admin/storage")
    return { success: true, file: uploadedFile }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: "Error uploading file" }
  }
}

export async function deleteFile(key: string) {
  try {
    await fleekService.deleteFile(key)
    revalidatePath("/admin/storage")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: "Error deleting file" }
  }
}

export async function listFiles(prefix?: string) {
  try {
    const files = await fleekService.listFiles(prefix)
    return { success: true, files }
  } catch (error) {
    console.error("Error listing files:", error)
    return { success: false, error: "Error listing files", files: [] }
  }
}

