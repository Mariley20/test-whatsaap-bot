import type { IWorkingHours } from '#shared/types/userTypes'
import type { IMedicalAppointment } from '#shared/types/medicalAppointmentTypes'

const SLOT_DURATION_MINUTES = 30

/**
 * Parses a time string "HH:mm" into total minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const parts = time.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  return hours * 60 + minutes
}

/**
 * Converts total minutes since midnight back to "HH:mm" format.
 */
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Returns the day of week (0=Sunday..6=Saturday) for a date string "YYYY-MM-DD".
 */
function getDayOfWeek(dateStr: string): number {
  const parts = dateStr.split('-').map(Number)
  const year = parts[0] ?? 0
  const month = parts[1] ?? 1
  const day = parts[2] ?? 1
  return new Date(year, month - 1, day).getDay()
}

/**
 * Generates 30-minute time slots within a doctor's working hours for a given date.
 *
 * @param workingHours - The doctor's working hours configuration
 * @param date - The date in "YYYY-MM-DD" format
 * @returns Array of time strings in "HH:mm" format
 */
export function generateTimeSlots(workingHours: IWorkingHours[], date: string): string[] {
  const dayOfWeek = getDayOfWeek(date)

  const daySchedule = workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
  if (!daySchedule || daySchedule.hours.length === 0) {
    return []
  }

  const slots: string[] = []

  for (const range of daySchedule.hours) {
    const startMinutes = timeToMinutes(range.startTime)
    const endMinutes = timeToMinutes(range.endTime)

    for (let current = startMinutes; current + SLOT_DURATION_MINUTES <= endMinutes; current += SLOT_DURATION_MINUTES) {
      slots.push(minutesToTime(current))
    }
  }

  return slots
}

/**
 * Filters out time slots that are already occupied by existing scheduled appointments.
 *
 * @param allSlots - All possible time slots for the day
 * @param existingAppointments - Existing appointments for the doctor on that date
 * @returns Array of available time slots (not occupied)
 */
export function filterAvailableSlots(
  allSlots: string[],
  existingAppointments: IMedicalAppointment[],
): string[] {
  const occupiedTimes = new Set(
    existingAppointments
      .filter(apt => apt.status === 'scheduled')
      .map(apt => apt.time),
  )

  return allSlots.filter(slot => !occupiedTimes.has(slot))
}
