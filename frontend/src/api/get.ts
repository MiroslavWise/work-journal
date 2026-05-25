import type { IJournalPage } from "~/interface/journal"

export const getJournalEntries = async (page: number): Promise<IJournalPage> => {
  const params = new URLSearchParams({ page: page.toString() })

  const res = await fetch(`/api/journal-entries?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Journal entries fetch failed: ${res.status}`)
  }

  return res.json() as Promise<IJournalPage>
}
