import { format, parse, isValid } from "date-fns"

export const API_DATE_FORMAT = "yyyy-MM-dd"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export function parseApiDate(value: string | undefined): Date | undefined {
  if (!value) return undefined

  const date = parse(value, API_DATE_FORMAT, new Date())
  return isValid(date) ? date : undefined
}

export function formatApiDate(date: Date): string {
  return format(date, API_DATE_FORMAT)
}

export function toApiDateString(value: string): string {
  const datePart = value.slice(0, 10)
  if (datePattern.test(datePart)) return datePart

  const parsed = new Date(value)
  return isValid(parsed) ? formatApiDate(parsed) : datePart
}
