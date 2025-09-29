"use client"

import * as React from "react"
import ReactDatePicker from "react-datepicker"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import "react-datepicker/dist/react-datepicker.css"

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
  const CustomInput = React.forwardRef<
    HTMLDivElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus-within:border-red-500 focus-within:ring-red-500 focus-within:ring-2 focus-within:ring-offset-2 bg-white hover:bg-gray-50 cursor-pointer flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <span className={cn(
        "block truncate text-sm",
        value ? "text-gray-900 font-medium" : "text-gray-500"
      )}>
        {value || placeholder}
      </span>
    </div>
  ))

  CustomInput.displayName = "CustomInput"

  return (
    <ReactDatePicker
      selected={date}
      onChange={(date: Date | null) => onDateChange?.(date || undefined)}
      minDate={minDate}
      disabled={disabled}
      dateFormat="dd MMM yyyy"
      placeholderText={placeholder}
      customInput={<CustomInput />}
      popperClassName="z-[100]"
      calendarClassName="shadow-xl border-0 rounded-lg"
      dayClassName={(date) =>
        "hover:bg-red-100 focus:bg-red-500 focus:text-white rounded-md"
      }
      weekDayClassName={() => "text-gray-600 font-medium"}
      monthClassName={() => "text-gray-800"}
      timeClassName={() => "text-gray-600"}
    />
  )
}
