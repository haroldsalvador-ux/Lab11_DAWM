"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ConfirmDelete } from "@/components/shared/ConfirmDelete"
import { projectProgress, useDashboard } from "@/context/DashboardContext"
import { categoryLabel, formatDate, initials } from "@/lib/data"
import { Project } from "@/lib/types"

const statusVariant = (status: string) =>
  status === "Completado" ? "default" : status === "En revisión" ? "secondary" : "outline"

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
      <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

export function ProjectsTab() {
  const { projects, members, tasks, deleteProject } = useDashboard()
  const [selected, setSelected] = useState<Project | null>(null)

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No hay proyectos registrados. Crea uno con el botón &quot;Nuevo Proyecto&quot;.
        </CardContent>
      </Card>
    )
  }

  const selectedMembers = selected ? members.filter((m) => selected.memberIds.includes(m.userId)) : []
  const selectedTasks = selected ? tasks.filter((t) => t.projectId === selected.id) : []

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const progress = projectProgress(project.id, tasks, project.status)
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description || "Sin descripción"}</CardDescription>
                  </div>
                  <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 4).map((id) => {
                        const member = members.find((m) => m.userId === id)
                        return member ? (
                          <Avatar key={id} className="h-7 w-7 border-2 border-background">
                            <AvatarFallback className="text-[10px]">{initials(member.name)}</AvatarFallback>
                          </Avatar>
                        ) : null
                      })}
                      <span className="whitespace-nowrap pl-4 text-sm text-muted-foreground">
                        {project.memberIds.length} {project.memberIds.length === 1 ? "miembro" : "miembros"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(project)}>
                        Ver detalles
                      </Button>
                      <ConfirmDelete
                        title="¿Eliminar proyecto?"
                        description={`Se eliminará "${project.name}" y sus tareas. Esta acción no se puede deshacer.`}
                        onConfirm={() => deleteProject(project.id)}
                        trigger={
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                            Eliminar
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detalle del proyecto */}
      <Dialog open={!!selected} onOpenChange={(value) => !value && setSelected(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.name}
                  <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                </DialogTitle>
                <DialogDescription>{selected.description || "Sin descripción"}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código</p>
                  <p className="font-medium">{selected.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <p className="font-medium">{categoryLabel(selected.category)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prioridad</p>
                  <p className="font-medium">{selected.priority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha de creación</p>
                  <p className="font-medium">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Progreso ({selectedTasks.filter((t) => t.status === "Completado").length} de {selectedTasks.length} tareas)
                  </span>
                  <span className="font-medium">{projectProgress(selected.id, tasks, selected.status)}%</span>
                </div>
                <ProgressBar value={projectProgress(selected.id, tasks, selected.status)} />
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Miembros del equipo ({selectedMembers.length})</h4>
                <div className="space-y-3">
                  {selectedMembers.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin miembros asignados.</p>
                  )}
                  {selectedMembers.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                      </div>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Tareas ({selectedTasks.length})</h4>
                <ul className="space-y-2">
                  {selectedTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin tareas registradas.</p>
                  )}
                  {selectedTasks.map((task) => (
                    <li key={task.id} className="flex items-center justify-between text-sm">
                      <span>{task.description}</span>
                      <Badge variant={task.status === "Completado" ? "default" : "outline"}>{task.status}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
