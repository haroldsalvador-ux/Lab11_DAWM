export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type Priority = "Baja" | "Media" | "Alta" | "Urgente"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: Priority
  status: ProjectStatus
  memberIds: string[]
  createdAt: string
}

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  dateline: string
}

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  date: number
}

export interface Settings {
  companyName: string
  ownerName: string
  email: string
  language: string
  timezone: string
  itemsPerPage: number
  notifications: boolean
  weeklyReport: boolean
}
