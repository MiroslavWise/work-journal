import type { IJournal } from "~/interface/journal"
import { formatApiDate, toApiDateString } from "~/lib/date"
import type { Schema } from "~/schemas/journal"

export function createJournalDefaultValues(): Schema {
  return {
    completion_date: formatApiDate(new Date()),
    work_type: "",
    unit: "",
    performer_name: "",
  } as Schema
}

export function journalEntryToSchema(entry: IJournal): Schema {
  return {
    completion_date: toApiDateString(entry.completion_date),
    work_type: entry.work_type,
    volume: entry.volume,
    unit: entry.unit,
    performer_name: entry.performer_name,
  }
}
