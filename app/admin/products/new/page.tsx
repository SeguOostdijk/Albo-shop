"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { categories, subcategories } from "@/lib/type/products"

const COLOR_MAP: Record<string, string> = {
  blanco: "#ffffff",
  negro: "#000000",
  azul: "#0000ff",
  rojo: "#ff0000",
  verde: "#008000",
  amarillo: "#ffff00",
  gris: "#808080",
  rosa: "#ffc0cb",
  violeta: "#800080",
  morado: "#800080",
  celeste: "#87ceeb",
  naranja: "#ffa500",
  marron: "#8b4513",
  marrón: "#8b4513",
  beige: "#f5f5dc",
  dorado: "#d4af37",
  plateado: "#c0c0c0",
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function slugify(value: string) {
  return normalizeText(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function getColorHex(color: string) {
  const normalized = normalizeText(color)
  return COLOR_MAP[normalized] ?? "#000000"
}

function generateSku(productSlug: string, color: string) {
  const base = `${slugify(productSlug)}-${slugify(color)}`
  const suffix = Date.now().toString().slice(-5)
  return `${base}-${suffix}`.toUpperCase()
}

export default function NewProductPage() {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [subcategorySlug, setSubcategorySlug] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const [variantColor, setVariantColor] = useState("")
  const [variantSizes, setVariantSizes] = useState("")
  const [variantStock, setVariantStock] = useState("")

  const [imageFile, setImageFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const generatedSlug = useMemo(() => slugify(name), [name])
  const generatedColorHex = useMemo(() => getColorHex(variantColor), [variantColor])
  const generatedSku = useMemo(() => {
    if (!slug && !generatedSlug) return ""
    if (!variantColor) return ""
    return generateSku(slug || generatedSlug, variantColor)
  }, [slug, generatedSlug, variantColor])

  const handleUseGeneratedSlug = () => {
    setSlug(generatedSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const finalSlug = slug || generatedSlug

    if (!name || !finalSlug || !categorySlug || !price || !variantColor || !variantStock) {
      setErrorMsg("Nombre, slug, categoría, precio, color y stock son obligatorios.")
      return
    }

    setLoading(true)

    const tags = subcategorySlug ? [subcategorySlug] : []

    let uploadedImageUrl: string | null = null

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop()
      const filePath = `${finalSlug}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile)

      if (uploadError) {
        setLoading(false)
        setErrorMsg(uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)

      uploadedImageUrl = publicUrlData.publicUrl
    }

    const { data: insertedProduct, error } = await supabase
      .from("products")
      .insert({
        name,
        slug: finalSlug,
        category_slug: categorySlug,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        description,
        is_featured: isFeatured,
        is_new: isNew,
        tags,
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
      })
      .select("id")
      .single()

    if (error) {
      setLoading(false)
      setErrorMsg(error.message)
      return
    }

    const sizesArray = variantSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const { error: variantError } = await supabase
      .from("product_variants")
      .insert({
        product_id: insertedProduct.id,
        color: variantColor,
        color_hex: generatedColorHex,
        sizes: sizesArray,
        sku: generatedSku,
        stock: variantStock ? Number(variantStock) : 0,
      })

    if (variantError) {
      setLoading(false)
      setErrorMsg(variantError.message)
      return
    }

    setLoading(false)
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo producto</h1>
        <p className="text-muted-foreground mt-1">
          Cargá la información básica del producto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Ej: Camiseta titular 2026"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <div className="flex gap-2">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="camiseta-titular-2026"
            />
            <button
              type="button"
              onClick={handleUseGeneratedSlug}
              className="rounded-md border px-3 py-2"
            >
              Autogenerar
            </button>
          </div>
          {generatedSlug && (
            <p className="mt-2 text-xs text-muted-foreground">
              Sugerido: {generatedSlug}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Categoría</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Subcategoría</label>
          <select
            value={subcategorySlug}
            onChange={(e) => setSubcategorySlug(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Sin subcategoría</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.slug} value={subcategory.slug}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Precio</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="59999"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Precio original</label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-md border px-3 py-2"
            placeholder="Descripción del producto"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Imagen principal</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Destacado
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
            />
            Nuevo
          </label>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Variante inicial</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Color</label>
              <input
                value={variantColor}
                onChange={(e) => setVariantColor(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ej: Blanco"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Color HEX</label>
              <input
                value={generatedColorHex}
                readOnly
                className="w-full rounded-md border px-3 py-2 bg-muted"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Talles</label>
              <input
                value={variantSizes}
                onChange={(e) => setVariantSizes(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="S, M, L, XL"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">SKU</label>
              <input
                value={generatedSku}
                readOnly
                className="w-full rounded-md border px-3 py-2 bg-muted"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Stock</label>
              <input
                type="number"
                min="0"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear producto"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-md border px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}