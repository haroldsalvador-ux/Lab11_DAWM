"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { FormErrors } from "@/components/shared/FormErrors"
import { useDashboard } from "@/context/DashboardContext"
import { CATEGORIES, PRIORITIES, PROJECT_STATUSES } from "@/lib/data"
import { Priority, ProjectStatus } from "@/lib/types"

const emptyForm = {
  name: "",
  description: "",
  category: "",
  priority: "",
  status: "Planificado",
  memberIds: [] as string[],
}

export function ProjectForm() {
  const { members, projects, addProject } = useDashboard()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const found: string[] = []
    if (formData.name.trim().length < 3) found.push("El nombre del proyecto debe tener al menos 3 caracteres.")
    if (!formData.category) found.push("Selecciona una categoría.")
    if (!formData.priority) found.push("Selecciona la prioridad.")
    if (formData.memberIds.length === 0) found.push("Asigna al menos un miembro del equipo.")
    return found
  }

  const toggleMember = (userId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: checked
        ? [...prev.memberIds, userId]
        : prev.memberIds.filter((id) => id !== userId),
    }))
  }

  const handleOpenChange = (value: boolean) => {
    if (loading) return
    setOpen(value)
    if (!value) {
      setFormData(emptyForm)
      setErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const found = validate()
    setErrors(found)
    if (found.length > 0) return

    // Simula la petición al backend mientras se muestra el Spinner
    setLoading(true)
    await addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority as Priority,
      status: formData.status as ProjectStatus,
      memberIds: formData.memberIds,
    })
    setLoading(false)

    // Limpiar y cerrar
    setFormData(emptyForm)
    setErrors([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campo nuevo: miembros del equipo */}
            <div className="grid gap-2">
              <Label>
                Miembros del Equipo <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-2 rounded-md border p-3 max-h-44 overflow-y-auto">
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aún no hay miembros registrados.</p>
                )}
                {members.map((member) => (
                  <div key={member.userId} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      id={`member-${member.userId}`}
                      checked={formData.memberIds.includes(member.userId)}
                      disabled={!!member.projectId}
                      onCheckedChange={(checked) => toggleMember(member.userId, checked === true)}
                    />
                    <Label
                      htmlFor={`member-${member.userId}`}
                      className={`font-normal ${member.projectId ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      <span className="font-medium">{member.name}</span>
                      <span className="text-muted-foreground">· {member.position}</span>
                      {member.projectId && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          · Asignado a {projects.find((project) => project.id === member.projectId)?.name ?? "otro proyecto"}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.memberIds.length} seleccionado(s). Cada miembro puede estar asignado a un solo proyecto.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Guardando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
