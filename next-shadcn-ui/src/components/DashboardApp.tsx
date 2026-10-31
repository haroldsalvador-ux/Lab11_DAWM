"use client"

import { useState } from "react"
import {
  Blocks,
  Building2,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Settings2,
  UsersRound,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { OverviewTab } from "@/components/OverviewTab"
import { ProjectsTab } from "@/components/ProjectsTab"
import { TeamTab } from "@/components/TeamTab"
import { SettingsForm } from "@/components/SettingsForm"
import { DashboardProvider, useDashboard } from "@/context/DashboardContext"

const sections = [
  { value: "overview", label: "Resumen", icon: LayoutDashboard, title: "Resumen ejecutivo", description: "Indicadores clave y actividad reciente de tus proyectos." },
  { value: "projects", label: "Proyectos", icon: FolderKanban, title: "Proyectos", description: "Organiza iniciativas, responsables y avances." },
  { value: "team", label: "Equipo", icon: UsersRound, title: "Equipo", description: "Administra los miembros y sus asignaciones." },
  { value: "tasks", label: "Tareas", icon: ListTodo, title: "Tareas", description: "Da seguimiento al trabajo y a las fechas de entrega." },
  { value: "settings", label: "Configuración", icon: Settings2, title: "Configuración", description: "Personaliza las preferencias del espacio de trabajo." },
]

function Dashboard() {
  const { settings, projects } = useDashboard()
  const [activeSection, setActiveSection] = useState("overview")
  const active = sections.find((section) => section.value === activeSection) ?? sections[0]
  const ownerInitials = settings.ownerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")

  return (
    <Tabs
      value={activeSection}
      onValueChange={setActiveSection}
      orientation="vertical"
      className="min-h-screen flex-col gap-0 bg-slate-50 md:flex-row"
    >
      <aside className="flex w-full shrink-0 flex-col bg-[#101827] px-4 py-4 text-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:px-5 md:py-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-950/30">
            <Blocks className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">NEXUS</p>
            <p className="text-xs text-slate-400">Project workspace</p>
          </div>
        </div>

        <div className="mt-7 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:block">
          Espacio de trabajo
        </div>
        <TabsList className="mt-3 !flex-row w-full flex-wrap items-stretch justify-start gap-1 overflow-visible rounded-none bg-transparent p-0 md:!flex-col">
          {sections.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-10 !w-max flex-none justify-start gap-3 rounded-lg border-0 px-3 text-slate-400 shadow-none hover:bg-white/5 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none after:hidden md:!w-full"
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-auto hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 md:block">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="size-4 text-violet-300" />
            <span className="truncate">{settings.companyName}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {projects.length} proyectos registrados en tu espacio de trabajo.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">{settings.companyName}</span>
            <span className="hidden text-slate-300 sm:inline">/</span>
            <span className="font-medium text-slate-800">{active.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-700">
                  {ownerInitials || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none text-slate-800">{settings.ownerName}</p>
                <p className="mt-1 text-xs text-slate-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] p-5 md:p-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
                Panel de control
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">
                {active.title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">{active.description}</p>
            </div>
            <ProjectForm />
          </div>

          <TabsContent value="overview" className="mt-0 space-y-5">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-5">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="team" className="mt-0 space-y-5">
            <TeamTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 space-y-5">
            <Card className="rounded-xl border-slate-200/80 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-5 py-4 md:px-6">
                <CardTitle className="text-base">Seguimiento de tareas</CardTitle>
                <CardDescription>Consulta y actualiza el trabajo de tus proyectos.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-6">
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-5">
            <SettingsForm />
          </TabsContent>
        </main>
      </div>
    </Tabs>
  )
}

export default function DashboardApp() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
