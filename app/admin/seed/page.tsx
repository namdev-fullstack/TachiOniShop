"use client"


import { Button } from "@/components/ui/button"
import { seedCategories } from "@/lib/seedCategories"

export default function SeedPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button
        onClick={seedCategories}
        className="bg-green-500 text-white"
      >
        Seed Categories
      </Button>
    </div>
  )
}