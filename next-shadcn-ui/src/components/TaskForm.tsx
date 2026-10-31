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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/shared/DatePicker"
import { FormErrors } from "@/components/shared/FormErrors"
import { useDashboard } from "@/context/DashboardContext"
import { PRIORITIES, TASK_STATUSES } from "@/lib/data"
import { Priority, Task, TaskStatus } from "@/lib/types"

const emptyTask = {
  description: "",
  projectId: "",
  status: "Pendiente" as TaskStatus,
  priority: "" as Priority | "",
  userId: "",
  dateline: "",
}

interface TaskFormProps {
  task?: Task // si llega, el formulario edita; si no, crea
  trigger: ReactNode
  onSaved?: () => void
}

export function TaskForm({ task, trigger, onSaved }: TaskFormProps) {
  const { projects, members, addTask, updateTask } = useDashboard()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(task ?? emptyTask)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Solo se puede asignar la tarea a miembros activos
  const activeMembers = members.filter((m) => m.isActive || m.userId === task?.userId)

  const validate = () => {
    const found: string[] = []
    if (form.description.trim().length < 5) found.push("La descripción debe tener al menos 5 caracteres.")
    if (!form.projectId) found.push("Selecciona el proyecto.")
    if (!form.priority) found.push("Selecciona la prioridad.")
    if (!form.userId) found.push("Asigna la tarea a un miembro del equipo.")
    if (!form.dateline) found.push("Selecciona la fecha límite.")
    return found
  }

  const handleOpenChange = (value: boolean) => {
    if (loading) return
    setOpen(value)
    if (value) setForm(task ?? emptyTask)
    setErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.length > 0) return

    setLoading(true)
    const data = { ...form, description: form.description.trim(), priority: form.priority as Priority }
    if (task) await updateTask({ ...data, id: task.id })
    else await addTask(data)
    setLoading(false)
    setOpen(false)
    onSaved?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
            <DialogDescription>
              {task ? "Actualiza la información de la tarea." : "Registra una tarea y asígnala a un miembro."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="taskDescription">Descripción <span className="text-red-500">*</span></Label>
              <Textarea
                id="taskDescription"
                placeholder="Ej: Implementar el login con Google"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taskProject">Proyecto <span className="text-red-500">*</span></Label>
              <Select value={form.projectId} onValueChange={(projectId) => setForm({ ...form, projectId })}>
                <SelectTrigger id="taskProject" className="w-full">
                  <SelectValue placeholder="Selecciona el proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskStatus">Estado</Label>
                <Select value={form.status} onValueChange={(status) => setForm({ ...form, status: status as TaskStatus })}>
                  <SelectTrigger id="taskStatus" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskPriority">Prioridad <span className="text-red-500">*</span></Label>
                <Select value={form.priority} onValueChange={(priority) => setForm({ ...form, priority: priority as Priority })}>
                  <SelectTrigger id="taskPriority" className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskUser">Asignado a <span className="text-red-500">*</span></Label>
                <Select value={form.userId} onValueChange={(userId) => setForm({ ...form, userId })}>
                  <SelectTrigger id="taskUser" className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeMembers.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDateline">Fecha límite <span className="text-red-500">*</span></Label>
                <DatePicker
                  id="taskDateline"
                  value={form.dateline}
                  onChange={(dateline) => setForm({ ...form, dateline })}
                  fromYear={new Date().getFullYear() - 1}
                  toYear={new Date().getFullYear() + 3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Guardando..." : task ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
