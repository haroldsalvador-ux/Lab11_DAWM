"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/shared/DatePicker"
import { FormErrors } from "@/components/shared/FormErrors"
import { useDashboard } from "@/context/DashboardContext"
import { ROLES } from "@/lib/data"
import { TeamMember } from "@/lib/types"

const NO_PROJECT = "none"

const emptyMember: Omit<TeamMember, "userId"> = {
  role: "",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
}

interface MemberFormProps {
  member?: TeamMember // si llega, el formulario edita; si no, crea
  trigger: ReactNode
}

export function MemberForm({ member, trigger }: MemberFormProps) {
  const { projects, members, addMember, updateMember } = useDashboard()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<TeamMember, "userId">>(member ?? emptyMember)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const isEdit = !!member

  const validate = () => {
    const found: string[] = []
    if (form.name.trim().length < 3) found.push("El nombre debe tener al menos 3 caracteres.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.push("Ingresa un email válido.")
    else if (members.some((m) => m.email === form.email && m.userId !== member?.userId))
      found.push("Ese email ya está registrado.")
    if (!form.role) found.push("Selecciona un rol.")
    if (!form.position.trim()) found.push("Ingresa el cargo.")
    if (!/^\d{9}$/.test(form.phone)) found.push("El teléfono debe tener 9 dígitos.")
    if (!form.birthdate) found.push("Selecciona la fecha de nacimiento.")
    else if (new Date(form.birthdate) > new Date()) found.push("La fecha de nacimiento no puede ser futura.")
    return found
  }

  const handleOpenChange = (value: boolean) => {
    if (loading) return
    setOpen(value)
    if (value) setForm(member ?? emptyMember)
    setErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.length > 0) return

    setLoading(true)
    const data = { ...form, name: form.name.trim(), position: form.position.trim() }
    if (member) await updateMember({ ...data, userId: member.userId })
    else await addMember(data)
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
            <DialogDescription>
              {isEdit ? `Actualiza los datos de ${member.name}.` : "Registra un nuevo integrante del equipo."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userId">ID de usuario</Label>
                <Input id="userId" value={member?.userId ?? "Se genera al guardar"} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol <span className="text-red-500">*</span></Label>
                <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memberName">Nombre completo <span className="text-red-500">*</span></Label>
              <Input
                id="memberName"
                placeholder="Ej: Rosa Quispe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="987654321"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Cargo <span className="text-red-500">*</span></Label>
                <Input
                  id="position"
                  placeholder="Ej: Frontend Developer"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Fecha de nacimiento <span className="text-red-500">*</span></Label>
                <DatePicker
                  id="birthdate"
                  value={form.birthdate}
                  onChange={(birthdate) => setForm({ ...form, birthdate })}
                  toYear={new Date().getFullYear()}
                  initialMonth={new Date(2000, 0)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="projectId">Proyecto asignado</Label>
              <Select
                value={form.projectId || NO_PROJECT}
                onValueChange={(value) => setForm({ ...form, projectId: value === NO_PROJECT ? "" : value })}
              >
                <SelectTrigger id="projectId" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PROJECT}>Sin proyecto</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="isActive">Miembro activo</Label>
                <p className="text-xs text-muted-foreground">Los miembros inactivos no cuentan en el resumen.</p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(isActive) => setForm({ ...form, isActive })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Agregar miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
