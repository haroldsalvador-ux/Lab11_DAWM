"use client"

import { useState } from "react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  id?: string
  value: string // formato yyyy-MM-dd
  onChange: (value: string) => void
  placeholder?: string
  fromYear?: number
  toYear?: number
  initialMonth?: Date // mes que se muestra si aún no hay fecha elegida
}

// Selector de fecha con el componente Calendar de shadcn/ui
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  fromYear = 1950,
  toYear = 2030,
  initialMonth,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn("w-full justify-start font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          selected={selected}
          defaultMonth={selected ?? initialMonth}
          captionLayout="dropdown"
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
