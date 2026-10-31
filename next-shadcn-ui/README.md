# Dashboard de Proyectos con shadcn/ui

Laboratorio 11 · Componentes y Estilización
Curso: Desarrollo de Aplicaciones Web Avanzado
Docente: Arévalo Sermeño, Edwin William

Dashboard construido con Next.js (App Router), TypeScript, Tailwind CSS y componentes de shadcn/ui. Todos los datos se manejan en memoria y cada acción simula una petición al backend.

## Funcionalidades

| Menú | Qué se puede hacer |
|---|---|
| Resumen | Métricas calculadas con los datos en memoria, actividad reciente y avance por proyecto |
| Proyectos | Crear proyectos con miembros del equipo, ver detalles y eliminar |
| Equipo | CRUD de miembros: `userId, role, name, email, position, birthdate, phone, projectId, isActive` |
| Tareas | CRUD de tareas con paginación: `description, projectId, status, priority, userId, dateline` |
| Configuración | Formulario de preferencias que afecta al dashboard (por ejemplo, elementos por página) |

## Componentes de shadcn/ui usados

- **Spinner:** se muestra mientras se simula la petición al backend al guardar o eliminar.
- **Alert:** muestra las validaciones de los formularios y la confirmación al guardar.
- **Calendar:** selección de la fecha de nacimiento y de la fecha límite de las tareas.
- **Pagination:** paginación en las tablas de Tareas y Equipo.
- Además: Card, Tabs, Dialog, AlertDialog, Select, Input, Textarea, Checkbox, Switch, Badge, Avatar, Table, Popover y Separator.

El tema del proyecto se cambió de Slate a violeta en `src/app/globals.css`.

## Requisitos

- Node.js 20.9 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre http://localhost:3000/dashboard en el navegador.

## Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
