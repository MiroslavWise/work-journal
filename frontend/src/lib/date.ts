import { format, parse, isValid } from "date-fns"

export const API_DATE_FORMAT = "yyyy-MM-dd"

export function parseApiDate(value: string | undefined): Date | undefined {
  if (!value) return undefined

  const date = parse(value, API_DATE_FORMAT, new Date())
  return isValid(date) ? date : undefined
}

export function formatApiDate(date: Date): string {
  return format(date, API_DATE_FORMAT)
}
