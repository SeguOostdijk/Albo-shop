"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ImageDropzone } from '@/components/ui/image-dropzone'
import { Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface Sponsor {
  id: string
  name: string
  image: string
  url: string
  position: number
  is_active: boolean
}

export function SponsorsManager() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    image: '',
    url: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('position')

    if (error) console.error('Error fetching sponsors:', error)
    else setSponsors(data || [])
    setLoading(false)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `sponsors/${Date.now()}-${file.name}`
      
      const { error } = await supabase.storage
        .from('sponsors')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data } = supabase.storage
        .from('sponsors')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageSelect = async (file: File) => {
    setImageFile(file)
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setNewSponsor({ ...newSponsor, image: imageUrl })
    }
  }

  const addSponsor = async () => {
    if (!newSponsor.name || !newSponsor.image || !newSponsor.url) return

    try {
      const nextPosition = sponsors.length
      const sponsorToAdd = { 
        ...newSponsor, 
        position: nextPosition 
      }

      const { data, error } = await supabase
        .from('sponsors')
        .insert([sponsorToAdd])
        .select()
        .single()

      if (error) throw error

      setSponsors([...sponsors, data])
      setNewSponsor({ name: '', image: '', url: '' })
      setImageFile(null)
    } catch (error: any) {
  console.error("Add sponsor error raw:", error)
  console.error("Add sponsor error message:", error?.message)
  console.error("Add sponsor error details:", error?.details)
  console.error("Add sponsor error hint:", error?.hint)
  console.error("Add sponsor error code:", error?.code)

  alert(
    error?.message ||
    error?.details ||
    error?.hint ||
    JSON.stringify(error, null, 2) ||
    "Unknown error"
  )
}
  }

  const deleteSponsor = async (id: string) => {
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
    } else {
      setSponsors(sponsors.filter(s => s.id !== id))
    }
  }

  const toggleActive = async (id: string) => {
    const sponsor = sponsors.find(s => s.id === id)
    if (!sponsor) return

    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: !sponsor.is_active })
      .eq('id', id)

    if (error) {
      console.error('Toggle error:', error)
    } else {
      setSponsors(sponsors.map(s => s.id === id ? { ...s, is_active: !sponsor.is_active } : s))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Add New Sponsor */}
      <Card className="border-0 bg-gradient-to-br from-muted/30 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Plus className="h-7 w-7" />
            Nuevo Sponsor
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Input
                placeholder="Nombre del sponsor"
                value={newSponsor.name}
                onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
              />
              <Input
                placeholder="https://sponsor.com"
                value={newSponsor.url}
                onChange={(e) => setNewSponsor({ ...newSponsor, url: e.target.value })}
              />
            </div>
            <div className="lg:col-span-2">
              <ImageDropzone onImageSelect={handleImageSelect} />
            </div>
          </div>
            <Button 
              type="button"
              onClick={addSponsor}
              className="mt-8 w-full lg:w-auto px-12 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 cursor-pointer"
              disabled={!newSponsor.name || !newSponsor.image || !newSponsor.url || uploading}
            >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Subiendo...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Agregar Sponsor
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Sponsors Grid */}
      <Card className="border-0 shadow-2xl backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Sponsors ({sponsors.filter(s => s.is_active).length})</CardTitle>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {sponsors.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="group relative border rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden bg-gradient-to-br from-background/50 to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 from-primary/5 to-accent/5 backdrop-blur-sm" />
                <div className="relative z-10 space-y-4">
                  <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl line-clamp-1">{sponsor.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{sponsor.url}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      type="button"
                      variant={sponsor.is_active ? "default" : "outline"} 
                      size="sm"
                      className="flex-1 font-medium cursor-pointer"
                      onClick={() => toggleActive(sponsor.id)}
                    >
                      {sponsor.is_active ? 'Activo ✅' : 'Inactivo ⚠️'}
                    </Button>
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="sm"
                      className="flex-none cursor-pointer"
                      onClick={() => deleteSponsor(sponsor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {sponsors.length === 0 && (
            <div className="text-center py-20 opacity-60">
              <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-medium text-muted-foreground">
                No hay sponsors aún. ¡Agrega el primero!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

