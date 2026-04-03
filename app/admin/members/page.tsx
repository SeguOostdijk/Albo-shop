"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft, Search, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

    function formatDate(dateString: string | null | undefined) {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
    })
    }

    type Member = {
    id: number
    member_name: string
    created_at: string
    is_active: boolean
    }

    export default function AdminMembersPage() {
    const supabase = createClient()

    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchMembers = async () => {
        setLoading(true)
        const { data, error } = await supabase
        .from("members")
        .select("id, member_name, created_at, is_active")
        .order("member_name", { ascending: true })

        if (error) {
        toast.error("Error al cargar los socios")
        } else {
        setMembers(data ?? [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const filtered = members.filter((m) =>
        m.member_name?.toLowerCase().includes(search.toLowerCase())
    )

    const handleToggleActive = async (member: Member) => {
    const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, is_active: !member.is_active }),
    })

    if (!res.ok) {
        toast.error("Error al cambiar el estado")
    } else {
        toast.success(!member.is_active ? "Socio activado" : "Socio desactivado")
        fetchMembers()
    }
    }

    const handleDelete = async (id: number) => {
    const confirmed = confirm("¿Seguro que querés eliminar este socio?")
    if (!confirmed) return

    const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    })

    if (!res.ok) {
        toast.error("Error al eliminar el socio")
    } else {
        toast.success("Socio eliminado")
        fetchMembers()
    }
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 lg:py-20 pb-12 sm:pb-16 lg:pb-20">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Socios
            </h1>
            </div>
            <div className="flex justify-start max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver al panel
            </Link>
            </div>
        </div>

        <Card className="max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto border border-slate-200/60 shadow-xl">
            <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shrink-0">
                    <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                    <CardTitle className="text-2xl sm:text-3xl font-black">
                    Listado de socios
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                    {filtered.length} de {members.length} socios
                    </p>
                </div>
                </div>

                <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar socio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                />
                </div>
            </div>
            </CardHeader>

            <CardContent>
            {loading ? (
                <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                No se encontraron socios.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                    <tr className="text-left">
                        <th className="px-4 py-3 font-bold">#</th>
                        <th className="px-4 py-3 font-bold">Nombre</th>
                        <th className="px-4 py-3 font-bold hidden sm:table-cell">Último pago</th>
                        <th className="px-4 py-3 font-bold">Estado</th>
                        <th className="px-4 py-3 font-bold text-right">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((member) => (
                        <tr key={member.id} className="border-t hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-muted-foreground">{member.id}</td>

                        <td className="px-4 py-3 font-medium">
                            {member.member_name ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                            {formatDate(member.created_at)}
                        </td>

                        <td className="px-4 py-3">
                            <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                member.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                            {member.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                title={member.is_active ? "Desactivar" : "Activar"}
                                className={`h-8 w-8 cursor-pointer ${
                                member.is_active
                                    ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                    : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                }`}
                                onClick={() => handleToggleActive(member)}
                            >
                                {member.is_active
                                ? <XCircle className="h-4 w-4" />
                                : <CheckCircle className="h-4 w-4" />
                                }
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                title="Eliminar"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                onClick={() => handleDelete(member.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </CardContent>
        </Card>
        </div>
    )
}