import { getGalleryImages } from "../lib/gallery"
import { describe, it, expect } from "@jest/globals"

describe("getGalleryImages", () => {
  it("returns images for valid category", async () => {
    const images = await getGalleryImages("black and grey")
    expect(images).toBeInstanceOf(Array)
    expect(images.length).toBeGreaterThan(0)
    expect(images[0]).toHaveProperty("src")
    expect(images[0]).toHaveProperty("alt")
  })

  it("returns empty array for invalid category", async () => {
    const images = await getGalleryImages("invalid-category")
    expect(images).toBeInstanceOf(Array)
    expect(images).toHaveLength(0)
  })
})

