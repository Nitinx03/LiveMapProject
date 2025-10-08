"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { X } from "lucide-react"
import { th } from "date-fns/locale"
import { getLocalDateString } from "@/lib/utils"

interface DateFilterDialogProps {
  selectedDate: string
  onDateChange: (date: string) => void
  onClose?: () => void
}

export function DateFilterDialog({ selectedDate, onDateChange, onClose }: DateFilterDialogProps) {
  const [date, setDate] = useState<Date>(new Date(selectedDate))

  useEffect(() => {
    setDate(new Date(selectedDate))
  }, [selectedDate])

  const disabledDates = useMemo(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const minDate = new Date("2024-01-01")
    minDate.setHours(0, 0, 0, 0)

    return (date: Date) => {
      return date > today || date < minDate
    }
  }, [])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      const dateString = getLocalDateString(newDate)
      onDateChange(dateString)
    }
  }

  const handleTodayClick = () => {
    const today = new Date()
    const todayString = getLocalDateString(today)
    setDate(today)
    onDateChange(todayString)
    onClose?.()
  }

  const handleYesterdayClick = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = getLocalDateString(yesterday)
    setDate(yesterday)
    onDateChange(yesterdayString)
    onClose?.()
  }

  return (
    <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">เลือกวันที่</h3>
        {onClose && (
          <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            locale={th}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleTodayClick}>
            วันนี้
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleYesterdayClick}>
            เมื่อวาน
          </Button>
        </div>
      </div>
    </div>
  )
}
