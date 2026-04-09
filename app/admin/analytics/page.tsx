"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  RefreshCw,
  Trophy,
  TrendingDown,
  Clock,
  DollarSign,
} from "lucide-react"

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

type AnalyticsData = {
  revenue: { today: number; week: number; month: number; year: number; total: number }
  orders: { today: number; week: number; month: number; year: number; total: number; pending: number }
  avgOrderValue: { today: number; week: number; month: number; year: number }
  topProducts: { name: string; quantity: number; revenue: number }[]
  worstProducts: { name: string; quantity: number; revenue: number }[]
}

type Period = "today" | "week" | "month" | "year"

const PERIOD_LABELS: Record<Period, string> = {
  today: "Hoy",
  week: "Esta semana",
  month: "Este mes",
  year: "Este año",
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>("month")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/analytics")
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="gap-2 rounded-xl border-slate-200 font-semibold cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Analytics</h1>
            <p className="text-sm text-slate-500">Métricas de ventas</p>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 flex-wrap">
          {(["today", "week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer ${
                period === p
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : !data ? (
          <p className="text-center text-slate-500 py-12">No se pudieron cargar los datos.</p>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-violet-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">Ganancias</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{formatPrice(data.revenue[period])}</p>
                  <p className="text-xs text-slate-400 mt-1">{PERIOD_LABELS[period]}</p>
                </CardContent>
              </Card>

              <Card className="border border-blue-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">Ventas</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{data.orders[period]}</p>
                  <p className="text-xs text-slate-400 mt-1">{PERIOD_LABELS[period]}</p>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">Ticket promedio</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{formatPrice(data.avgOrderValue[period])}</p>
                  <p className="text-xs text-slate-400 mt-1">{PERIOD_LABELS[period]}</p>
                </CardContent>
              </Card>

              <Card className="border border-amber-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">Pendientes</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">{data.orders.pending}</p>
                  <p className="text-xs text-slate-400 mt-1">Sin despachar</p>
                </CardContent>
              </Card>
            </div>

            {/* Totals row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border border-slate-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-slate-500 mb-1">Ganancias totales acumuladas</p>
                  <p className="text-3xl font-black text-slate-800">{formatPrice(data.revenue.total)}</p>
                  <p className="text-xs text-slate-400 mt-1">{data.orders.total} ventas históricas</p>
                </CardContent>
              </Card>
              <Card className="border border-slate-200/60 bg-white shadow-md">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-slate-500 mb-2">Resumen por período</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {(["today", "week", "month", "year"] as Period[]).map((p) => (
                      <div key={p} className="flex justify-between">
                        <span className="text-slate-500">{PERIOD_LABELS[p]}:</span>
                        <span className="font-bold text-slate-700">{formatPrice(data.revenue[p])}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Best sellers */}
              <Card className="border border-emerald-200/60 bg-white shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-700">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    Productos más vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {data.topProducts.length === 0 ? (
                    <p className="text-sm text-slate-400">Sin datos</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topProducts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-black text-emerald-600 w-5 shrink-0">#{i + 1}</span>
                            <span className="text-sm font-medium text-slate-700 truncate">{p.name}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-slate-800">{p.quantity} ud.</span>
                            <p className="text-xs text-slate-400">{formatPrice(p.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Worst sellers */}
              <Card className="border border-red-200/60 bg-white shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-700">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    Productos menos vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {data.worstProducts.length === 0 ? (
                    <p className="text-sm text-slate-400">Sin datos suficientes</p>
                  ) : (
                    <div className="space-y-3">
                      {data.worstProducts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-black text-red-400 w-5 shrink-0">#{i + 1}</span>
                            <span className="text-sm font-medium text-slate-700 truncate">{p.name}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-slate-800">{p.quantity} ud.</span>
                            <p className="text-xs text-slate-400">{formatPrice(p.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
