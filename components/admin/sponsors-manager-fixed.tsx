"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ImageDropzone } from '@/components/ui/image-dropzone'
import { Trash2, Plus, Grip } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

interface Sponsor {
  id: string
  name: string
  image: string
  url: string | null
  position: number
  is_active: boolean
  type?: string
  description?: string
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

  // Edit state
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    image: '',
    url: '',
    position: '',
  })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editUploading, setEditUploading] = useState(false)

  // DnD state
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const supabase = createClient()

  const handleEditImageSelect = async (file: File) => {
    setEditImageFile(file)
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setEditForm({ ...editForm, image: imageUrl })
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
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
    } catch (error: any) {
      console.error('Upload error:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const updateSponsor = async () => {
    if (!editingSponsor) return

    try {
      const updates: any = {
        name: editForm.name,
        position: parseInt(editForm.position || editingSponsor.position.toString()),
        url: editForm.url || null,
      }

      if (editForm.image !== editingSponsor.image) {
        updates.image = editForm.image
      }

      const { error } = await supabase
        .from('sponsors')
        .update(updates)
        .eq('id', editingSponsor.id)

      if (error) throw error

      // Update local state
      setSponsors(sponsors.map(s => s.id === editingSponsor.id ? { ...s, ...updates } : s))
      setIsEditModalOpen(false)
      setEditingSponsor(null)
    } catch (error: any) {
      console.error('Update error:', error)
      alert('Error updating sponsor: ' + error.message)
    }
  }

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

  const handleImageSelect = async (file: File) => {
    setImageFile(file)
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setNewSponsor({ ...newSponsor, image: imageUrl })
    }
  }

  const addSponsor = async () => {
    if (!newSponsor.name || !newSponsor.image) return

    try {
      const nextPosition = sponsors.length ? Math.max(...sponsors.map(s => s.position)) + 1 : 1
      const sponsorToAdd = { 
        ...newSponsor, 
        url: newSponsor.url || null,
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
      console.error("Add sponsor error:", error)
      alert("Error adding sponsor: " + error.message)
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetSponsor: Sponsor) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetSponsor.id) return

    const dragSponsor = sponsors.find(s => s.id === draggedId)
    if (!dragSponsor) return

    try {
      const [update1, update2] = await Promise.all([
        supabase.from('sponsors').update({ position: targetSponsor.position }).eq('id', draggedId),
        supabase.from('sponsors').update({ position: dragSponsor.position }).eq('id', targetSponsor.id)
      ])

      // Update local
      setSponsors(sponsors.map(s => {
        if (s.id === draggedId) return { ...s, position: targetSponsor.position }
        if (s.id === targetSponsor.id) return { ...s, position: dragSponsor.position }
        return s
      }))

      setDraggedId(null)
    } catch (error: any) {
      console.error('Reorder error:', error)
      alert('Error reordering: ' + error.message)
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
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,1fr)_2.3fr] gap-12 max-w-[95vw] mx-auto min-h-[450px] pb-12">
      {/* Add New Sponsor */}
      <Card className="border-0 bg-gradient-to-br from-muted/30 backdrop-blur-sm shadow-xl h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Plus className="h-5 w-5" />
            Nuevo Sponsor
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <Input
              placeholder="Nombre del sponsor"
              value={newSponsor.name}
              onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
            />
            <Input
              placeholder="https://sponsor.com (opcional)"
              value={newSponsor.url}
              onChange={(e) => setNewSponsor({ ...newSponsor, url: e.target.value })}
            />
            <ImageDropzone onImageSelect={handleImageSelect} />
          </div>
          <Button 
            type="button"
            onClick={addSponsor}
            className="w-full h-12 text-base font-semibold shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 mt-4 cursor-pointer"
            disabled={!newSponsor.name || !newSponsor.image || uploading}
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
            <CardTitle className="text-xl">Sponsors ({sponsors.filter(s => s.is_active).length})</CardTitle>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {sponsors.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => (
              <div 
                key={sponsor.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, sponsor.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sponsor)}
                className="group relative border rounded-xl p-4 h-48 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-gradient-to-br from-background/50 to-muted/20 flex flex-col cursor-grab active:cursor-grabbing [&[data-dragging='true']]:!opacity-30 [&[data-dragging='true']]:!scale-95"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${sponsor.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="relative z-10 flex items-start">
                  {/* Drag handle */}
                  <div className="mr-2 mt-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing">
                    <Grip className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col h-full space-y-3 pt-4 flex-1 min-w-0">
                    <div className="flex-1 min-h-0 text-center px-2 flex flex-col items-center justify-center space-y-1">
                      <h3 className="font-semibold line-clamp-1 text-sm bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">{sponsor.name}</h3>
                      {sponsor.url && (
                        <p className="text-xs text-muted-foreground truncate max-w-full bg-background/80 backdrop-blur-sm px-3 py-1 rounded">{sponsor.url}</p>
                      )}
                    </div>
                    <div className="flex gap-1.5 bg-background/90 backdrop-blur-sm p-1.5 rounded-lg border shadow-sm">
                      <Button 
                        type="button"
                        variant={sponsor.is_active ? "default" : "outline"} 
                        size="sm"
                        className="flex-1 text-xs font-bold cursor-pointer h-8"
                        onClick={() => toggleActive(sponsor.id)}
                      >
                        {sponsor.is_active ? 'ACTIVO' : 'INACTIVO'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-none text-xs font-bold cursor-pointer h-8 px-2"
                        onClick={() => {
                          setEditingSponsor(sponsor)
                          setEditForm({
                            name: sponsor.name,
                            image: sponsor.image,
                            url: sponsor.url || '',
                            position: sponsor.position.toString(),
                          })
                          setIsEditModalOpen(true)
                        }}
                      >
                        Editar
                      </Button>
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="sm"
                        className="flex-none text-xs font-bold cursor-pointer h-8 px-2"
                        onClick={() => deleteSponsor(sponsor.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Edit Modal */}
            <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Editar Sponsor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Modifica los datos del sponsor y su posición.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>URL (opcional)</Label>
                    <Input
                      placeholder="https://..."
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Nueva Imagen</Label>
                    <ImageDropzone onImageSelect={handleEditImageSelect} />
                  </div>
                  <div>
                    <Label>Posición</Label>
                    <Select value={editForm.position} onValueChange={(v) => setEditForm({ ...editForm, position: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: sponsors.length + 1 }, (_, i) => i + 1).map(p => (
                          <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={updateSponsor}>Guardar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {sponsors.length === 0 && (
            <div className="grid place-items-center h-64 text-muted-foreground">
              <Plus className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay sponsors</h3>
              <p className="text-sm opacity-75">Agrega el primero usando el formulario</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
