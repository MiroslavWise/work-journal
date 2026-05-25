export interface IJournal {
  id: number
  completion_date: string
  work_type: string
  volume: number
  unit: string
  performer_name: string
  created_at: string
}

export interface IJournalPage {
  items: IJournal[]
  page: number
  page_size: number
  total: number
  total_pages: number
}
