import type { IJournal } from "~/interface/journal";

interface IJournalResponse {
  items: IJournal[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const getJournalEntries = async () => {
  return await fetch("/api/journal-entries")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Journal entries fetch failed: ${res.status}`);
      }
      return res.json() as Promise<IJournalResponse>;
    })
    .then((data: any) => {
      return data?.items;
    });
};
