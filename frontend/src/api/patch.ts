import type { Schema } from "~/schemas/journal"
import type { IJournal } from "~/interface/journal"

export const updateJournalEntry = async (id: number, payload: Schema): Promise<IJournal> => {
  const res = await fetch(`/api/journal-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Journal entry update failed: ${res.status}`)
  }

  return res.json() as Promise<IJournal>
}
