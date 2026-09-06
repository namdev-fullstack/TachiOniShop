"use client"

import { useState } from "react"
import { db } from "@/lib/firebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { Layers, PlusCircle } from "lucide-react"

// convert slug
function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export default function CategoryPage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!name) return alert("Nhập tên category đi bro 😅")

    setLoading(true)
    try {
      const slug = generateSlug(name)

      await addDoc(collection(db, "categories"), {
        name,
        slug,
        created_at: serverTimestamp(),
      })

      setSuccess("Thêm category thành công 🎉")
      setName("")
    } catch (err) {
      console.error(err)
      alert("Lỗi rồi bro 😢")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card className="shadow-xl border-0 rounded-2xl">
        <CardContent className="p-6 space-y-6">
          
          {/* Title */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <Layers className="w-5 h-5 text-indigo-500" />
            Thêm Category
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label>Tên thể loại</Label>
            <Input
              placeholder="VD: Acc VIP, Trắng Thông Tin..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Preview slug */}
          {name && (
            <div className="text-sm text-gray-500">
              Slug:{" "}
              <span className="font-semibold text-indigo-500">
                {generateSlug(name)}
              </span>
            </div>
          )}

          {/* Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {loading ? "Đang thêm..." : "Thêm Category"}
          </Button>

          {/* Success */}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}