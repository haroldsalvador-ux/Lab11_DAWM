import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Alert de shadcn/ui para mostrar las validaciones del formulario
export function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Revisa el formulario</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
