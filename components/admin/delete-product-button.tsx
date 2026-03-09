"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar "${productName}"? Esta acción no se puede deshacer.`
    )

    if (!confirmed) return

    setLoading(true)

    const { error: variantsError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId)

    if (variantsError) {
      alert(variantsError.message)
      setLoading(false)
      return
    }

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (productError) {
      alert(productError.message)
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 disabled:opacity-50"
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  )
}