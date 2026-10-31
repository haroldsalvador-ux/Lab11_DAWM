"use client"

import { ReactNode, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface ConfirmDeleteProps {
  title: string
  description: string
  onConfirm: () => Promise<void>
  trigger: ReactNode
}

// Confirmación antes de eliminar; muestra un Spinner mientras se simula la petición
export function ConfirmDelete({ title, description, onConfirm, trigger }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !loading && setOpen(value)}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
