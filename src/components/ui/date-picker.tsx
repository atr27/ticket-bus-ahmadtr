"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange?.(selectedDate)
      setOpen(false) // Close the popover after selection
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Stop event bubbling
    setOpen(!open)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            type="button" // Explicitly set type to button to prevent form submission
            variant={"outline"}
            onClick={handleButtonClick}
            className={cn(
              "w-full justify-start text-left font-normal h-12 pl-12 pr-4 rounded-xl border-2 focus:border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-2 bg-white hover:bg-gray-50 relative",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <span className="block truncate">
              {date ? format(date, "PPP") : placeholder}
            </span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true
            return false
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
