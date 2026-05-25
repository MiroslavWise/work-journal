import type { CreateJournalEntryPayload } from "~/schemas/journal"
import type { IJournal } from "~/interface/journal"

export const createJournalEntry = async (
  payload: CreateJournalEntryPayload,
): Promise<IJournal> => {
  const res = await fetch("/api/journal-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Journal entry create failed: ${res.status}`)
  }

  return res.json() as Promise<IJournal>
}
