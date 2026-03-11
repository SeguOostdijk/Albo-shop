"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  return base.toUpperCase()
}

type Variant = {
  id: string
  color: string
  color_hex: string
  sizes: string[]
  sku: string
  stock: number
}

export default function EditProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [subcategorySlug, setSubcategorySlug] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const [isOnSale, setIsOnSale] = useState(false)
  const [salePercentage, setSalePercentage] = useState("")

  const [variantId, setVariantId] = useState<string | null>(null)
  const [variantColor, setVariantColor] = useState("")
  const [variantSizes, setVariantSizes] = useState("")
  const [variantStock, setVariantStock] = useState("")

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImages, setCurrentImages] = useState<string[]>([])

  const generatedSlug = useMemo(() => slugify(name), [name])
  const generatedColorHex = useMemo(() => getColorHex(variantColor), [variantColor])
  const generatedSku = useMemo(() => {
    if (!slug && !generatedSlug) return ""
    if (!variantColor) return ""
    return generateSku(slug || generatedSlug, variantColor)
  }, [slug, generatedSlug, variantColor])

  const basePrice = Number(price || 0)
  const discountValue = Number(salePercentage || 0)
  const previewFinalPrice = isOnSale
    ? Math.round(basePrice * (1 - discountValue / 100))
    : basePrice

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setErrorMsg("")

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          category_slug,
          price,
          original_price,
          description,
          is_featured,
          is_new,
          is_on_sale,
          sale_percentage,
          tags,
          images,
          product_variants (
            id,
            color,
            color_hex,
            sizes,
            sku,
            stock
          )
        `)
        .eq("id", id)
        .single()

      if (error || !data) {
        setErrorMsg(error?.message ?? "No se pudo cargar el producto")
        setLoading(false)
        return
      }

      setName(data.name ?? "")
      setSlug(data.slug ?? "")
      setCategorySlug(data.category_slug ?? "")
      setDescription(data.description ?? "")
      setIsFeatured(!!data.is_featured)
      setIsNew(!!data.is_new)
      setIsOnSale(!!data.is_on_sale)
      setSalePercentage(data.sale_percentage ? String(data.sale_percentage) : "")
      setCurrentImages(Array.isArray(data.images) ? data.images : [])

      if (data.is_on_sale && data.original_price) {
        setPrice(String(data.original_price))
      } else {
        setPrice(String(data.price ?? ""))
      }

      const tags = Array.isArray(data.tags) ? data.tags : []
      setSubcategorySlug(tags[0] ?? "")

      const firstVariant = Array.isArray(data.product_variants) ? data.product_variants[0] : null

      if (firstVariant) {
        const v = firstVariant as Variant
        setVariantId(v.id)
        setVariantColor(v.color ?? "")
        setVariantSizes(Array.isArray(v.sizes) ? v.sizes.join(", ") : "")
        setVariantStock(String(v.stock ?? 0))
      }

      setLoading(false)
    }

    loadProduct()
  }, [id, supabase])

  const handleUseGeneratedSlug = () => {
    setSlug(generatedSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const finalSlug = slug || generatedSlug

    if (!name || !finalSlug || !categorySlug || !price) {
      setErrorMsg("Nombre, slug, categoría y precio son obligatorios.")
      return
    }

    if (!variantColor) {
      setErrorMsg("Debes indicar al menos un color para la variante.")
      return
    }

    if (!variantStock) {
      setErrorMsg("Debes indicar el stock.")
      return
    }

    if (isOnSale) {
      const percentage = Number(salePercentage)

      if (!salePercentage) {
        setErrorMsg("Debes indicar el porcentaje de descuento.")
        return
      }

      if (Number.isNaN(percentage) || percentage <= 0 || percentage >= 100) {
        setErrorMsg("El porcentaje de descuento debe estar entre 1 y 99.")
        return
      }
    }

    setSaving(true)

    const tags = subcategorySlug ? [subcategorySlug] : []

    let finalImages = currentImages

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop()
      const filePath = `${finalSlug}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile)

      if (uploadError) {
        setSaving(false)
        setErrorMsg(uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)

      finalImages = [publicUrlData.publicUrl]
    }

    const finalPrice = isOnSale
      ? Math.round(Number(price) * (1 - Number(salePercentage) / 100))
      : Number(price)

    const originalPrice = isOnSale ? Number(price) : null

    const { error: productError } = await supabase
      .from("products")
      .update({
        name,
        slug: finalSlug,
        category_slug: categorySlug,
        price: finalPrice,
        original_price: originalPrice,
        description,
        is_featured: isFeatured,
        is_new: isNew,
        is_on_sale: isOnSale,
        sale_percentage: isOnSale ? Number(salePercentage) : null,
        tags,
        images: finalImages,
      })
      .eq("id", id)

    if (productError) {
      setSaving(false)
      setErrorMsg(productError.message)
      return
    }

    const sizesArray = variantSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (variantId) {
      const { error: variantError } = await supabase
        .from("product_variants")
        .update({
          color: variantColor,
          color_hex: generatedColorHex,
          sizes: sizesArray,
          sku: generatedSku,
          stock: Number(variantStock),
        })
        .eq("id", variantId)

      if (variantError) {
        setSaving(false)
        setErrorMsg(variantError.message)
        return
      }
    } else {
      const { error: variantInsertError } = await supabase
        .from("product_variants")
        .insert({
          product_id: id,
          color: variantColor,
          color_hex: generatedColorHex,
          sizes: sizesArray,
          sku: generatedSku,
          stock: Number(variantStock),
        })

      if (variantInsertError) {
        setSaving(false)
        setErrorMsg(variantInsertError.message)
        return
      }
    }

    setSaving(false)
    router.push("/admin/products")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar producto</h1>
        <p className="text-muted-foreground mt-1">
          Modificá la información del producto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Nombre</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <div className="flex gap-2">
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
            <button
              type="button"
              onClick={handleUseGeneratedSlug}
              className="rounded-md border px-3 py-2"
            >
              Autogenerar
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Categoría</label>
          <select
            required
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

        <div>
          <label className="mb-2 block text-sm font-medium">Precio base</label>
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isOnSale}
              onChange={(e) => {
                setIsOnSale(e.target.checked)
                if (!e.target.checked) setSalePercentage("")
              }}
            />
            En oferta
          </label>

          {isOnSale && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">% de descuento</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={salePercentage}
                  onChange={(e) => setSalePercentage(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="20"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Precio base: ${basePrice || 0}</p>
                <p>Precio final: ${previewFinalPrice || 0}</p>
              </div>
            </>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Imagen principal</label>

          {currentImages.length > 0 && (
            <div className="mb-3">
              <img
                src={currentImages[0]}
                alt={name}
                className="h-32 w-32 rounded-md border object-cover"
              />
            </div>
          )}

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
                required
                value={variantColor}
                onChange={(e) => setVariantColor(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
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
                required
                type="number"
                min="0"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
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