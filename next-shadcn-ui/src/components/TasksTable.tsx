"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { ConfirmDelete } from "@/components/shared/ConfirmDelete"
import { PaginationControls } from "@/components/shared/PaginationControls"
import { TaskForm } from "@/components/TaskForm"
import { useDashboard } from "@/context/DashboardContext"
import { TASK_STATUSES, formatDate } from "@/lib/data"
import { Task } from "@/lib/types"

const ALL = "all"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, projects, members, settings, updateTask, deleteTask } = useDashboard()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(ALL)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filtered = tasks.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === ALL || t.status === statusFilter)
  )
  const perPage = settings.itemsPerPage
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—"
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"
  const isOverdue = (task: Task) =>
    task.status !== "Completado" && task.dateline < new Date().toISOString().slice(0, 10)

  // Marcar o desmarcar una tarea como completada desde el checkbox
  const toggleComplete = async (task: Task, checked: boolean) => {
    setTogglingId(task.id)
    await updateTask({ ...task, status: checked ? "Completado" : "Pendiente" })
    setTogglingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Buscar tarea..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="sm:max-w-xs"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los estados</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Al crear, se vuelve a la página 1 donde aparece la tarea nueva */}
        <TaskForm trigger={<Button>+ Nueva tarea</Button>} onSaved={() => setPage(1)} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Hecho</TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No hay tareas que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
            {visible.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  {togglingId === task.id ? (
                    <Spinner />
                  ) : (
                    <Checkbox
                      checked={task.status === "Completado"}
                      onCheckedChange={(checked) => toggleComplete(task, checked === true)}
                      aria-label="Marcar como completada"
                    />
                  )}
                </TableCell>
                <TableCell
                  className={`font-medium ${task.status === "Completado" ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.description}
                </TableCell>
                <TableCell>{projectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{memberName(task.userId)}</TableCell>
                <TableCell className={isOverdue(task) ? "text-destructive font-medium" : ""}>
                  {formatDate(task.dateline)}
                  {isOverdue(task) && <span className="block text-xs">Vencida</span>}
                </TableCell>
                <TableCell className="text-right">
                  <TaskForm task={task} trigger={<Button variant="ghost" size="sm">Editar</Button>} />
                  <ConfirmDelete
                    title="¿Eliminar tarea?"
                    description={`Se eliminará la tarea "${task.description}".`}
                    onConfirm={() => deleteTask(task.id)}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Eliminar
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        <p className="text-xs text-muted-foreground">
          Mostrando {visible.length} de {filtered.length} tareas · página {currentPage} de {totalPages}
        </p>
      </div>
    </div>
  )
}
