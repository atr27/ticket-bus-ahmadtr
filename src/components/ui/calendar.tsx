"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-lg shadow-lg border border-gray-200", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center pt-2 pb-2 relative items-center mb-2",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white hover:bg-red-50 hover:border-red-200 p-0 border border-gray-300 rounded-md transition-colors"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse mt-2",
        head_row: "flex mb-2",
        head_cell:
          "text-gray-600 w-10 h-10 font-semibold text-xs uppercase tracking-wide flex items-center justify-center",
        row: "flex w-full mb-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal hover:bg-gray-100 rounded-md transition-all duration-200"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 rounded-md font-medium shadow-sm",
        day_today: "bg-red-50 text-red-700 font-semibold border border-red-200 rounded-md",
        day_outside:
          "day-outside text-gray-400 opacity-60 hover:bg-gray-50",
        day_disabled: "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-red-100 aria-selected:text-red-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
