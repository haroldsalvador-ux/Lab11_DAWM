import { Activity, Priority, Project, ProjectStatus, Settings, Task, TaskStatus, TeamMember } from "@/lib/types"

export const CATEGORIES = [
  { value: "web", label: "Desarrollo Web" },
  { value: "mobile", label: "Desarrollo Mobile" },
  { value: "design", label: "Diseño" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Otro" },
]

export const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"]
export const PROJECT_STATUSES: ProjectStatus[] = ["Planificado", "En progreso", "En revisión", "Completado"]
export const TASK_STATUSES: TaskStatus[] = ["Pendiente", "En progreso", "Completado"]
export const ROLES = ["Administrador", "Líder", "Miembro", "Invitado"]

export const initialMembers: TeamMember[] = [
  { userId: "U001", role: "Líder", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1995-04-12", phone: "987654321", projectId: "P001", isActive: true },
  { userId: "U002", role: "Miembro", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1993-09-03", phone: "912345678", projectId: "P001", isActive: true },
  { userId: "U003", role: "Miembro", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1998-01-25", phone: "956781234", projectId: "P002", isActive: false },
  { userId: "U004", role: "Miembro", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1991-11-18", phone: "934567812", projectId: "P004", isActive: true },
  { userId: "U005", role: "Administrador", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1989-06-30", phone: "945678123", projectId: "P005", isActive: true },
]

export const initialProjects: Project[] = [
  { id: "P001", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "Alta", status: "En progreso", memberIds: ["U001", "U002"], createdAt: "2026-08-04" },
  { id: "P002", name: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "Media", status: "En revisión", memberIds: ["U003"], createdAt: "2026-08-20" },
  { id: "P003", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "Media", status: "Planificado", memberIds: [], createdAt: "2026-09-02" },
  { id: "P004", name: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "Urgente", status: "En progreso", memberIds: ["U004"], createdAt: "2026-09-10" },
  { id: "P005", name: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "Baja", status: "Completado", memberIds: ["U005"], createdAt: "2026-07-15" },
  { id: "P006", name: "Marketing Website", description: "Sitio web institucional", category: "marketing", priority: "Media", status: "En progreso", memberIds: [], createdAt: "2026-10-01" },
]

export const initialTasks: Task[] = [
  { id: "T001", description: "Implementar autenticación", projectId: "P001", status: "En progreso", priority: "Alta", userId: "U001", dateline: "2026-11-15" },
  { id: "T002", description: "Diseñar pantalla de perfil", projectId: "P002", status: "Pendiente", priority: "Media", userId: "U003", dateline: "2026-11-20" },
  { id: "T003", description: "Configurar CI/CD", projectId: "P004", status: "Completado", priority: "Alta", userId: "U004", dateline: "2026-11-10" },
  { id: "T004", description: "Optimizar queries SQL", projectId: "P001", status: "En progreso", priority: "Urgente", userId: "U002", dateline: "2026-11-12" },
  { id: "T005", description: "Documentar API endpoints", projectId: "P004", status: "Pendiente", priority: "Baja", userId: "U005", dateline: "2026-11-25" },
  { id: "T006", description: "Crear guía de colores", projectId: "P005", status: "Completado", priority: "Media", userId: "U003", dateline: "2026-10-05" },
  { id: "T007", description: "Publicar componentes en npm", projectId: "P005", status: "Completado", priority: "Alta", userId: "U005", dateline: "2026-10-20" },
  { id: "T008", description: "Integrar pasarela de pagos", projectId: "P001", status: "Pendiente", priority: "Urgente", userId: "U002", dateline: "2026-12-01" },
  { id: "T009", description: "Redactar textos de la landing", projectId: "P006", status: "En progreso", priority: "Media", userId: "U005", dateline: "2026-11-18" },
  { id: "T010", description: "Pruebas en dispositivos Android", projectId: "P002", status: "Pendiente", priority: "Alta", userId: "U003", dateline: "2026-11-28" },
  { id: "T011", description: "Configurar balanceador de carga", projectId: "P004", status: "Completado", priority: "Alta", userId: "U004", dateline: "2026-10-28" },
  { id: "T012", description: "Definir métricas del dashboard", projectId: "P003", status: "Pendiente", priority: "Baja", userId: "U001", dateline: "2026-12-10" },
]

export const initialActivity: Activity[] = [
  { id: "A1", user: "María García", action: "completó la tarea", target: "Diseño de UI", date: Date.now() - 5 * 60 * 1000 },
  { id: "A2", user: "Juan Pérez", action: "comentó en", target: "API Backend", date: Date.now() - 60 * 60 * 1000 },
  { id: "A3", user: "Ana López", action: "creó un nuevo", target: "Proyecto Mobile", date: Date.now() - 2 * 60 * 60 * 1000 },
  { id: "A4", user: "Carlos Ruiz", action: "actualizó", target: "Documentación", date: Date.now() - 3 * 60 * 60 * 1000 },
]

export const initialSettings: Settings = {
  companyName: "Mi Empresa S.A.C.",
  ownerName: "Administrador",
  email: "admin@miempresa.com",
  language: "es",
  timezone: "America/Lima",
  itemsPerPage: 5,
  notifications: true,
  weeklyReport: false,
}

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}

export function formatDate(value: string) {
  if (!value) return "—"
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
}

export function timeAgo(date: number) {
  const minutes = Math.round((Date.now() - date) / 60000)
  if (minutes < 1) return "Hace un momento"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`
  const days = Math.round(hours / 24)
  return `Hace ${days} ${days === 1 ? "día" : "días"}`
}
