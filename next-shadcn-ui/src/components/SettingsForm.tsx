"use client"

import { useState } from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { FormErrors } from "@/components/shared/FormErrors"
import { useDashboard } from "@/context/DashboardContext"
import { Settings } from "@/lib/types"

export function SettingsForm() {
  const { settings, saveSettings } = useDashboard()
  const [form, setForm] = useState<Settings>(settings)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (data: Partial<Settings>) => {
    setForm({ ...form, ...data })
    setSaved(false)
  }

  const validate = () => {
    const found: string[] = []
    if (!form.companyName.trim()) found.push("Ingresa el nombre de la empresa.")
    if (form.ownerName.trim().length < 3) found.push("El nombre del responsable debe tener al menos 3 caracteres.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.push("Ingresa un email de contacto válido.")
    return found
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    setSaved(false)
    if (found.length > 0) return

    setLoading(true)
    await saveSettings({ ...form, companyName: form.companyName.trim(), ownerName: form.ownerName.trim() })
    setLoading(false)
    setSaved(true)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <FormErrors errors={errors} />
          {saved && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Cambios guardados</AlertTitle>
              <AlertDescription>La configuración se actualizó correctamente.</AlertDescription>
            </Alert>
          )}

          <section className="space-y-4">
            <h3 className="font-semibold">Datos generales</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Nombre de la empresa</Label>
                <Input id="companyName" value={form.companyName} onChange={(e) => update({ companyName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Responsable</Label>
                <Input id="ownerName" value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="settingsEmail">Email de contacto</Label>
                <Input id="settingsEmail" type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="font-semibold">Preferencias</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={form.language} onValueChange={(language) => update({ language })}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                    <SelectItem value="pt">Portugués</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Zona horaria</Label>
                <Select value={form.timezone} onValueChange={(timezone) => update({ timezone })}>
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                    <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                    <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemsPerPage">Elementos por página</Label>
                <Select
                  value={String(form.itemsPerPage)}
                  onValueChange={(value) => update({ itemsPerPage: Number(value) })}
                >
                  <SelectTrigger id="itemsPerPage" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 10, 20].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="font-semibold">Notificaciones</h3>
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <Label htmlFor="notifications">Notificaciones por email</Label>
                <p className="text-sm text-muted-foreground">Recibe un aviso cuando te asignen una tarea.</p>
              </div>
              <Switch
                id="notifications"
                checked={form.notifications}
                onCheckedChange={(notifications) => update({ notifications })}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <Label htmlFor="weeklyReport">Reporte semanal</Label>
                <p className="text-sm text-muted-foreground">Resumen del avance de los proyectos cada lunes.</p>
              </div>
              <Switch
                id="weeklyReport"
                checked={form.weeklyReport}
                onCheckedChange={(weeklyReport) => update({ weeklyReport })}
              />
            </div>
          </section>
        </CardContent>

        <CardFooter className="justify-end gap-2 pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setForm(settings)
              setErrors([])
              setSaved(false)
            }}
          >
            Descartar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Guardando..." : "Guardar configuración"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
