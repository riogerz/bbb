"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { InstagramIcon, Loader2 } from "lucide-react"
import { getInstagramFeed } from "@/app/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InstagramPost {
  id: string
  media_url: string
  permalink: string
  caption?: string
  media_type: string
  thumbnail_url?: string
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)

  const refreshFeed = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getInstagramFeed()
      if (result.success && result.data) {
        setPosts(result.data)
      } else {
        setError(result.error || "Failed to load feed")
      }
    } catch (err) {
      setError("Failed to load feed")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshFeed()
  }, [refreshFeed])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-white/70">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={refreshFeed}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Dialog key={post.id}>
            <DialogTrigger asChild>
              <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={post.media_url || "/placeholder.svg"}
                  alt={post.caption || "Tattoo artwork"}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50">
                  <div className="flex h-full items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <InstagramIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Latest Work</DialogTitle>
                <DialogDescription>{post.caption || "Check out this tattoo design"}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={post.media_url || "/placeholder.svg"}
                  alt={post.caption || "Tattoo artwork"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => refreshFeed()}>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Refresh Gallery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={refreshFeed}>
          <InstagramIcon className="mr-2 h-4 w-4" />
          Refresh Gallery
        </Button>
      </div>
    </div>
  )
}

