"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Users, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewMemberPage() {
    const router = useRouter()

    const [memberName, setMemberName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!memberName.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }

        setIsLoading(true)

        const res = await fetch("/api/admin/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ member_name: memberName }),
        })

        if (!res.ok) {
            toast.error("Error al crear el socio")
        } else {
            toast.success("Socio creado correctamente")
            router.push("/admin/members")
        }

        setIsLoading(false)
        }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 lg:py-20 pb-12 sm:pb-16 lg:pb-20">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Nuevo socio
            </h1>
            </div>
        </div>

        {/* Botón volver */}
        <div className="flex justify-start max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-8">
            <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
            >
            <ArrowLeft className="h-4 w-4" />
            Volver a panel
            </Link>
        </div>

        <Card className="max-w-full sm:max-w-xl mx-auto border border-slate-200/60 shadow-xl">
            <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                <CardTitle className="text-2xl font-black">Agregar socio</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    El socio se creará como activo
                </p>
                </div>
            </div>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="memberName">Nombre completo (Primero va apellido)</Label>
                <Input
                    id="memberName"
                    placeholder="Ej: Pérez Juan"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="rounded-xl"
                    autoFocus
                />
                </div>

                <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                {isLoading ? "Creando..." : "Crear socio"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}