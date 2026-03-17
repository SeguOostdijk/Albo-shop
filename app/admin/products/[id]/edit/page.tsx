"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { categories, subcategories } from '@/lib/type/products'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X, Plus } from 'lucide-react'
import { ImageDropzone } from '@/components/ui/image-dropzone'

const COLOR_MAP: Record<string, string> = {
  blanco: '#ffffff',
  negro: '#000000',
  azul: '#0000ff',
  rojo: '#ff0000',
  verde: '#008000',
  amarillo: '#ffff00',
  gris: '#808080',
  rosa: '#ffc0cb',
  violeta: '#800080',
  morado: '#800080',
  celeste: '#87ceeb',
  naranja: '#ffa500',
  marron: '#8b4513',
  marrón: '#8b4513',
  beige: '#f5f5dc',
  dorado: '#d4af37',
  plateado: '#c0c0c0',
}

type Variant = {
  id: string
  color: string
  color_hex: string
  sku: string
}

type StockRow = {
  size: string
  stock: number
}

type SizeStockRow = {
  size: string
  stock: string
}

type ProductImage = {
  url: string
  file?: File
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function slugify(value: string) {
  return normalizeText(value)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getColorHex(color: string) {
  const normalized = normalizeText(color)
  return COLOR_MAP[normalized] ?? '#000000'
}

function generateSku(productSlug: string, color: string) {
  const base = `${slugify(productSlug)}-${slugify(color)}`
  return base.toUpperCase()
}

export default function EditProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [subcategorySlug, setSubcategorySlug] = useState('')
  const [price, setPrice] = useState('')
  const [memberPrice, setMemberPrice] = useState('')
  const [description, setDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const [isOnSale, setIsOnSale] = useState(false)
  const [salePercentage, setSalePercentage] = useState('')

  const [variantId, setVariantId] = useState<string | null>(null)
  const [variantColor, setVariantColor] = useState('')

  const [sizeStocks, setSizeStocks] = useState<SizeStockRow[]>([
    { size: '', stock: '' },
  ])

  const [currentImages, setCurrentImages] = useState<ProductImage[]>([])
  const [pendingImages, setPendingImages] = useState<File[]>([])

  const generatedSlug = useMemo(() => slugify(name), [name])
  const generatedColorHex = useMemo(() => getColorHex(variantColor), [variantColor])
  const generatedSku = useMemo(() => {
    if (!slug && !generatedSlug) return ''
    if (!variantColor) return ''
    return generateSku(slug || generatedSlug, variantColor)
  }, [slug, generatedSlug, variantColor])

  const basePrice = Number(price || 0)
  const discountValue = Number(salePercentage || 0)
  const previewFinalPrice = isOnSale
    ? Math.round(basePrice * (1 - discountValue / 100))
    : basePrice

  const totalImages = currentImages.length + pendingImages.length

  const addSizeStockRow = () => {
    setSizeStocks((prev) => [...prev, { size: '', stock: '' }])
  }

  const removeSizeStockRow = (index: number) => {
    setSizeStocks((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSizeStockRow = (
    index: number,
    field: 'size' | 'stock',
    value: string
  ) => {
    setSizeStocks((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value.toUpperCase() } : row
      )
    )
  }

  const handleImageSelect = (file: File) => {
    setPendingImages((prev) => [...prev, file])
  }

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeCurrentImage = (index: number) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setErrorMsg('')

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          category_slug,
          price,
          member_price,
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
            sku
          ),
          product_stock (
            size,
            stock
          )
        `)
        .eq('id', id)
        .single()

      if (error || !data) {
        setErrorMsg(error?.message ?? 'No se pudo cargar el producto')
        setLoading(false)
        return
      }

      setName(data.name ?? '')
      setSlug(data.slug ?? '')
      setCategorySlug(data.category_slug ?? '')
      setMemberPrice(data.member_price ? String(data.member_price) : '')
      setDescription(data.description ?? '')
      setIsFeatured(!!data.is_featured)
      setIsNew(!!data.is_new)
      setIsOnSale(!!data.is_on_sale)
      setSalePercentage(data.sale_percentage ? String(data.sale_percentage) : '')
      setCurrentImages((Array.isArray(data.images) ? data.images : []).map(url => ({ url } as ProductImage)))

      if (data.is_on_sale && data.original_price) {
        setPrice(String(data.original_price))
      } else {
        setPrice(String(data.price ?? ''))
      }

      const tags = Array.isArray(data.tags) ? data.tags : []
      setSubcategorySlug(tags[0] ?? '')

      const firstVariant = Array.isArray(data.product_variants) ? data.product_variants[0] : null
      if (firstVariant) {
        const v = firstVariant as Variant
        setVariantId(v.id)
        setVariantColor(v.color ?? '')
      }

      const stockRows = Array.isArray(data.product_stock)
        ? (data.product_stock as StockRow[])
        : []

      if (stockRows.length > 0) {
        setSizeStocks(
          stockRows.map((row) => ({
            size: row.size,
            stock: String(row.stock ?? 0),
          }))
        )
      } else {
        setSizeStocks([{ size: '', stock: '' }])
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
    setErrorMsg('')

    const finalSlug = slug || generatedSlug

    if (!name || !finalSlug || !categorySlug || !price) {
      setErrorMsg('Nombre, slug, categoría y precio son obligatorios.')
      return
    }

    if (!variantColor) {
      setErrorMsg('Debes indicar al menos un color para la variante.')
      return
    }

    const validSizeStocks = sizeStocks.filter(
      (row) => row.size.trim() !== '' && row.stock.trim() !== ''
    )

    if (categorySlug === 'accesorios' ) {
      // Accesorios no requieren talles
    } else if (validSizeStocks.length === 0) {
      setErrorMsg('Debes cargar al menos un talle con su stock.')
      return
    }

    if (isOnSale) {
      const percentage = Number(salePercentage)

      if (!salePercentage) {
        setErrorMsg('Debes indicar el porcentaje de descuento.')
        return
      }

      if (Number.isNaN(percentage) || percentage <= 0 || percentage >= 100) {
        setErrorMsg('El porcentaje de descuento debe estar entre 1 y 99.')
        return
      }
    }

    setSaving(true)

    const tags = subcategorySlug ? [subcategorySlug] : []

    // Upload pending images
    let finalImages = [...currentImages.map(img => img.url)]
    for (const file of pendingImages) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${finalSlug}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      if (publicUrlData.publicUrl) {
        finalImages.push(publicUrlData.publicUrl)
      }
    }

    const finalPrice = isOnSale
      ? Math.round(Number(price) * (1 - Number(salePercentage) / 100))
      : Number(price)

    const originalPrice = isOnSale ? Number(price) : null

    const { error: productError } = await supabase
      .from('products')
      .update({
        name,
        slug: finalSlug,
        category_slug: categorySlug,
        price: finalPrice,
        member_price: memberPrice ? Number(memberPrice) : null,
        original_price: originalPrice,
        description,
        is_featured: isFeatured,
        is_new: isNew,
        is_on_sale: isOnSale,
        sale_percentage: isOnSale ? Number(salePercentage) : null,
        tags,
        images: finalImages,
      })
      .eq('id', id)

    if (productError) {
      setSaving(false)
      setErrorMsg(productError.message)
      return
    }

    if (variantId) {
      const { error: variantError } = await supabase
        .from('product_variants')
        .update({
          color: variantColor,
          color_hex: generatedColorHex,
          sku: generatedSku,
        })
        .eq('id', variantId)

      if (variantError) {
        setSaving(false)
        setErrorMsg(variantError.message)
        return
      }
    } else {
      const { error: variantInsertError } = await supabase
        .from('product_variants')
        .insert({
          product_id: id,
          color: variantColor,
          color_hex: generatedColorHex,
          sku: generatedSku,
        })

      if (variantInsertError) {
        setSaving(false)
        setErrorMsg(variantInsertError.message)
        return
      }
    }

    const { error: deleteStockError } = await supabase
      .from('product_stock')
      .delete()
      .eq('product_id', id)

    if (deleteStockError) {
      setSaving(false)
      setErrorMsg(deleteStockError.message)
      return
    }

    const stockRows = validSizeStocks.map((row) => ({
      product_id: id,
      size: row.size.trim(),
      stock: Number(row.stock),
    }))

    const { error: insertStockError } = await supabase
      .from('product_stock')
      .insert(stockRows)

    if (insertStockError) {
      setSaving(false)
      setErrorMsg(insertStockError.message)
      return
    }

    setSaving(false)
    setPendingImages([])
    router.push('/admin/products')
    router.refresh()
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p>Cargando producto...</p>
      </div>
    )
  }

  return (
    <>
      <div className='fixed top-4 left-4 z-50 flex gap-2'>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </Button>
      </div>
      <div className='container mx-auto max-w-2xl px-4 pt-20 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Editar producto</h1>

        <form onSubmit={handleSubmit} className='space-y-5 rounded-lg border p-6'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full rounded-md border px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Slug</label>
            <div className='flex gap-2'>
              <input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className='w-full rounded-md border px-3 py-2'
              />
              <button
                type='button'
                onClick={handleUseGeneratedSlug}
                className='rounded-md border px-3 py-2 cursor-pointer'
              >
                Autogenerar
              </button>
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Categoría</label>
            <select
              required
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className='w-full rounded-md border px-3 py-2 cursor-pointer'
            >
              <option value=''>Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug} className="cursor-pointer hover:bg-accent">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Subcategoría</label>
            <select
              value={subcategorySlug}
              onChange={(e) => setSubcategorySlug(e.target.value)}
              className='w-full rounded-md border px-3 py-2 cursor-pointer'
            >
              <option value=''>Sin subcategoría</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug} className="cursor-pointer hover:bg-accent">
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Precio base</label>
            <input
              required
              type='number'
              min='0'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='w-full rounded-md border px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Precio socio</label>
            <input
              type='number'
              min='0'
              value={memberPrice}
              onChange={(e) => setMemberPrice(e.target.value)}
              className='w-full rounded-md border px-3 py-2'
              placeholder='Opcional'
            />
          </div>

          <div className='rounded-md border p-4 space-y-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className="cursor-pointer"
                checked={isOnSale}
                onChange={(e) => {
                  setIsOnSale(e.target.checked)
                  if (!e.target.checked) setSalePercentage('')
                }}
              />
              En oferta
            </label>

            {isOnSale && (
              <>
                <div>
                  <label className='mb-2 block text-sm font-medium'>% de descuento</label>
                  <input
                    type='number'
                    min='1'
                    max='99'
                    value={salePercentage}
                    onChange={(e) => setSalePercentage(e.target.value)}
                    className='w-full rounded-md border px-3 py-2'
                    placeholder='20'
                  />
                </div>

                <div className='text-sm text-muted-foreground'>
                  <p>Precio base: ${basePrice || 0}</p>
                  <p>Precio final: ${previewFinalPrice || 0}</p>
                </div>
              </>
            )}
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='min-h-[120px] w-full rounded-md border px-3 py-2'
            />
          </div>

          <div className="w-full">
            <label className='mb-2 block text-sm font-medium'>Imágenes del producto ({totalImages})</label>
            <ImageDropzone onImageSelect={handleImageSelect} />
            
            {/* Current Images */}
            {currentImages.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm font-medium mb-2 text-muted-foreground'>Imágenes actuales:</p>
                <div className='grid grid-cols-3 gap-2'>
                  {currentImages.map((img, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={img.url}
                        alt={`Imagen ${index + 1}`}
                        className='w-full h-24 object-cover rounded-md border'
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => removeCurrentImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Images */}
            {pendingImages.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm font-medium mb-2 text-muted-foreground'>Nuevas imágenes (pendientes):</p>
                <div className='grid grid-cols-3 gap-2'>
                  {pendingImages.map((file, index) => (
                    <div key={index} className='relative bg-muted p-2 rounded-md'>
                      <div className='w-full h-24 bg-muted-foreground/20 rounded animate-pulse' />
                      <p className='text-xs mt-1 truncate'>{file.name}</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 cursor-pointer"
                        onClick={() => removePendingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='space-y-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className="cursor-pointer"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Destacado
            </label>

            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                className="cursor-pointer"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
              />
              Nuevo
            </label>
          </div>

          <div className='mt-6 border-t pt-6'>
            <h2 className='text-lg font-semibold mb-4'>Variante inicial</h2>

            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium'>Color</label>
                <input
                  required
                  value={variantColor}
                  onChange={(e) => setVariantColor(e.target.value)}
                  className='w-full rounded-md border px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>Color HEX</label>
                <input
                  value={generatedColorHex}
                  readOnly
                  className='w-full rounded-md border px-3 py-2 bg-muted'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>SKU</label>
                <input
                  value={generatedSku}
                  readOnly
                  className='w-full rounded-md border px-3 py-2 bg-muted'
                />
              </div>
            </div>

            <div className='mt-6'>
              <div className='flex items-center justify-between mb-3'>
                <label className='block text-sm font-medium'>Talles y stock</label>
                <button
                  type='button'
                  onClick={addSizeStockRow}
                  className='rounded-md border px-3 py-1 text-sm cursor-pointer'
                >
                  + Agregar talle
                </button>
              </div>

              <div className='space-y-3'>
                {sizeStocks.map((row, index) => (
                  <div key={index} className='grid grid-cols-12 gap-3 items-end'>
                    <div className='col-span-6'>
                      <label className='mb-2 block text-sm font-medium'>Talle</label>
                      <input
                        value={row.size ? row.size.toUpperCase() : ''}
                        onChange={(e) =>
                          updateSizeStockRow(index, 'size', e.target.value)
                        }
                        className='w-full rounded-md border px-3 py-2 font-normal uppercase tracking-widest text-base'
                        placeholder='EJ: S'
                      />
                    </div>

                    <div className='col-span-4'>
                      <label className='mb-2 block text-sm font-medium'>Stock</label>
                      <input
                        type='number'
                        min='0'
                        value={row.stock}
                        onChange={(e) =>
                          updateSizeStockRow(index, 'stock', e.target.value)
                        }
                        className='w-full rounded-md border px-3 py-2'
                        placeholder='10'
                      />
                    </div>

                    <div className='col-span-2'>
                      <button
                        type='button'
                        onClick={() => removeSizeStockRow(index)}
                        className='w-full rounded-md border px-3 py-2 text-sm text-red-600 cursor-pointer'
                        disabled={sizeStocks.length === 1}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {errorMsg && <p className='text-sm text-red-600'>{errorMsg}</p>}

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50 cursor-pointer'
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <Link href='/admin/products' className='cursor-pointer'>
              <Button variant='outline' className='h-10 cursor-pointer'>
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

