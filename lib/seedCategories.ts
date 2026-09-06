import { db } from "@/lib/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"

const categories = [
  {
    id: "vip",
    name: "Acc VIP",
    slug: "vip"
  },
  {
    id: "white",
    name: "Trắng Thông Tin",
    slug: "white"
  },
  {
    id: "info",
    name: "Có Thông Tin",
    slug: "info"
  }
]

export const seedCategories = async () => {
  try {
    for (const c of categories) {
      await setDoc(doc(db, "categories", c.id), {
        id: c.id,
        name: c.name,
        slug: c.slug,
        created_at: new Date()
      })
      console.log(`✅ Created: ${c.name}`)
    }

    console.log("🔥 DONE SEED CATEGORIES")
  } catch (err) {
    console.error("❌ Error:", err)
  }
}