"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDelete } from "@/components/shared/ConfirmDelete"
import { PaginationControls } from "@/components/shared/PaginationControls"
import { MemberForm } from "@/components/MemberForm"
import { useDashboard } from "@/context/DashboardContext"
import { formatDate, initials } from "@/lib/data"

export function TeamTab() {
  const { members, projects, settings, deleteMember } = useDashboard()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = members.filter((m) =>
    `${m.name} ${m.email} ${m.position} ${m.role}`.toLowerCase().includes(search.toLowerCase())
  )
  const perPage = settings.itemsPerPage
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Sin proyecto"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
        </div>
        <MemberForm trigger={<Button>+ Nuevo miembro</Button>} />
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Buscar por nombre, email, cargo o rol..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="mb-4"
        />

        <div className="space-y-4">
          {visible.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No se encontraron miembros.</p>
          )}
          {visible.map((member) => (
            <div
              key={member.userId}
              className="flex flex-col gap-4 p-4 border rounded-lg md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.name} <span className="text-xs text-muted-foreground">· {member.userId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.position} · {member.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.email} · {member.phone} · Nac. {formatDate(member.birthdate)}
                  </p>
                  <p className="text-xs text-primary mt-1">{projectName(member.projectId)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <MemberForm member={member} trigger={<Button size="sm" variant="outline">Editar</Button>} />
                <ConfirmDelete
                  title="¿Eliminar miembro?"
                  description={`Se retirará a ${member.name} del equipo y de sus proyectos.`}
                  onConfirm={() => deleteMember(member.userId)}
                  trigger={
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      Eliminar
                    </Button>
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          <p className="text-xs text-muted-foreground">
            {filtered.length} miembro(s) · página {currentPage} de {totalPages}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
