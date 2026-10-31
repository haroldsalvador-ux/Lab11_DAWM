"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { projectProgress, useDashboard } from "@/context/DashboardContext"
import { PROJECT_STATUSES, initials, timeAgo } from "@/lib/data"

function StatIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4 text-muted-foreground"
    >
      {children}
    </svg>
  )
}

export function OverviewTab() {
  const { projects, tasks, members, activity } = useDashboard()

  // Métricas calculadas con los datos en memoria
  const completedProjects = projects.filter((p) => p.status === "Completado").length
  const completedTasks = tasks.filter((t) => t.status === "Completado").length
  const pendingTasks = tasks.length - completedTasks
  const today = new Date().toISOString().slice(0, 10)
  const overdueTasks = tasks.filter((t) => t.status !== "Completado" && t.dateline < today).length
  const activeMembers = members.filter((m) => m.isActive).length
  const completion = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  const stats = [
    {
      title: "Total Proyectos",
      value: projects.length,
      detail: `${completedProjects} completado(s)`,
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
    {
      title: "Tareas Completadas",
      value: `${completedTasks}/${tasks.length}`,
      detail: `${completion}% del total`,
      icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    },
    {
      title: "Tareas Pendientes",
      value: pendingTasks,
      detail: `${overdueTasks} vencida(s)`,
      icon: (
        <>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </>
      ),
    },
    {
      title: "Miembros Activos",
      value: activeMembers,
      detail: `de ${members.length} en el equipo`,
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-xl border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <StatIcon>{stat.icon}</StatIcon>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</div>
              <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="rounded-xl border-slate-200/80 shadow-sm lg:col-span-4">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <CardDescription>Últimos movimientos registrados en el espacio de trabajo.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-5">
              {activity.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">Aún no hay actividad registrada.</p>
              )}
              {activity.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-700">
                      {initials(item.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{item.user}</p>
                    <p className="truncate text-sm text-slate-500">
                      {item.action} <span className="font-medium text-slate-700">{item.target}</span>
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">{timeAgo(item.date)}</time>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200/80 shadow-sm lg:col-span-3">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base">Proyectos por estado</CardTitle>
            <CardDescription>Distribución y avance de la cartera actual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {PROJECT_STATUSES.map((status) => {
              const count = projects.filter((p) => p.status === status).length
              const percent = projects.length ? Math.round((count / projects.length) * 100) : 0
              return (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-600">{status}</span>
                    <span className="font-medium text-slate-800">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Avance por proyecto</p>
              <ul className="space-y-3 text-sm">
                {projects.length === 0 && (
                  <li className="text-slate-500">No hay proyectos para mostrar.</li>
                )}
                {projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-slate-600">{p.name}</span>
                    <span className="shrink-0 font-medium text-slate-800">{projectProgress(p.id, tasks, p.status)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
