"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Activity, Project, Settings, Task, TeamMember } from "@/lib/types"
import {
  initialActivity,
  initialMembers,
  initialProjects,
  initialSettings,
  initialTasks,
} from "@/lib/data"

// Simula la espera de una petición al backend
const simulateRequest = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const nextId = (prefix: string, ids: string[]) => {
  const max = ids.reduce((acc, id) => Math.max(acc, Number(id.replace(/\D/g, "")) || 0), 0)
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

interface DashboardContextValue {
  projects: Project[]
  members: TeamMember[]
  tasks: Task[]
  activity: Activity[]
  settings: Settings
  addProject: (data: Omit<Project, "id" | "createdAt">) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addMember: (data: Omit<TeamMember, "userId">) => Promise<void>
  updateMember: (data: TeamMember) => Promise<void>
  deleteMember: (userId: string) => Promise<void>
  addTask: (data: Omit<Task, "id">) => Promise<void>
  updateTask: (data: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  saveSettings: (data: Settings) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activity, setActivity] = useState<Activity[]>(initialActivity)
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const log = (action: string, target: string, user = settings.ownerName) => {
    setActivity((prev) => [
      { id: crypto.randomUUID(), user, action, target, date: Date.now() },
      ...prev,
    ])
  }

  // ---------- Proyectos ----------
  const addProject: DashboardContextValue["addProject"] = async (data) => {
    await simulateRequest()
    const id = nextId("P", projects.map((p) => p.id))
    const today = new Date().toISOString().slice(0, 10)
    const memberIds = new Set(data.memberIds)
    setProjects((prev) => [
      ...prev.map((project) => ({
        ...project,
        memberIds: project.memberIds.filter((memberId) => !memberIds.has(memberId)),
      })),
      { ...data, id, createdAt: today },
    ])
    setMembers((prev) =>
      prev.map((member) =>
        memberIds.has(member.userId) ? { ...member, projectId: id } : member
      )
    )
    log("creó el proyecto", data.name)
  }

  const deleteProject: DashboardContextValue["deleteProject"] = async (id) => {
    await simulateRequest()
    const project = projects.find((p) => p.id === id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    // Las tareas del proyecto se eliminan y los miembros quedan sin proyecto asignado
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) => prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m)))
    if (project) log("eliminó el proyecto", project.name)
  }

  // ---------- Equipo ----------
  const addMember: DashboardContextValue["addMember"] = async (data) => {
    await simulateRequest()
    const userId = nextId("U", members.map((m) => m.userId))
    setMembers((prev) => [...prev, { ...data, userId }])
    if (data.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === data.projectId && !p.memberIds.includes(userId)
            ? { ...p, memberIds: [...p.memberIds, userId] }
            : p
        )
      )
    }
    log("agregó al equipo a", data.name)
  }

  const updateMember: DashboardContextValue["updateMember"] = async (data) => {
    await simulateRequest()
    setMembers((prev) => prev.map((m) => (m.userId === data.userId ? data : m)))
    setProjects((prev) =>
      prev.map((project) => {
        const memberIds = project.memberIds.filter((id) => id !== data.userId)
        return project.id === data.projectId
          ? { ...project, memberIds: [...memberIds, data.userId] }
          : { ...project, memberIds }
      })
    )
    log("actualizó los datos de", data.name)
  }

  const deleteMember: DashboardContextValue["deleteMember"] = async (userId) => {
    await simulateRequest()
    const member = members.find((m) => m.userId === userId)
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    setProjects((prev) => prev.map((p) => ({ ...p, memberIds: p.memberIds.filter((id) => id !== userId) })))
    setTasks((prev) => prev.map((t) => (t.userId === userId ? { ...t, userId: "" } : t)))
    if (member) log("retiró del equipo a", member.name)
  }

  // ---------- Tareas ----------
  const addTask: DashboardContextValue["addTask"] = async (data) => {
    await simulateRequest()
    const id = nextId("T", tasks.map((t) => t.id))
    setTasks((prev) => [{ ...data, id }, ...prev])
    log("creó la tarea", data.description)
  }

  const updateTask: DashboardContextValue["updateTask"] = async (data) => {
    await simulateRequest()
    setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)))
    log(data.status === "Completado" ? "completó la tarea" : "actualizó la tarea", data.description)
  }

  const deleteTask: DashboardContextValue["deleteTask"] = async (id) => {
    await simulateRequest()
    const task = tasks.find((t) => t.id === id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (task) log("eliminó la tarea", task.description)
  }

  // ---------- Configuración ----------
  const saveSettings: DashboardContextValue["saveSettings"] = async (data) => {
    await simulateRequest(1200)
    setSettings(data)
    // Se usa el nombre recién guardado, no el anterior
    log("actualizó la", "Configuración", data.ownerName)
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        members,
        tasks,
        activity,
        settings,
        addProject,
        deleteProject,
        addMember,
        updateMember,
        deleteMember,
        addTask,
        updateTask,
        deleteTask,
        saveSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return context
}

// Progreso del proyecto calculado con sus tareas completadas
export function projectProgress(projectId: string, tasks: Task[], status?: string) {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  if (projectTasks.length === 0) return status === "Completado" ? 100 : 0
  const done = projectTasks.filter((t) => t.status === "Completado").length
  return Math.round((done / projectTasks.length) * 100)
}
