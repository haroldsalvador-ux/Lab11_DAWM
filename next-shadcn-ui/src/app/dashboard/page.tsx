"use client"

import dynamic from "next/dynamic"
import { Spinner } from "@/components/ui/spinner"

// El dashboard trabaja con datos en memoria del navegador (fechas, actividad reciente),
// por eso se renderiza solo en el cliente. Mientras carga se muestra el Spinner.
const DashboardApp = dynamic(() => import("@/components/DashboardApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-8 text-primary" />
      <p>Cargando dashboard...</p>
    </div>
  ),
})

export default function DashboardPage() {
  return <DashboardApp />
}
