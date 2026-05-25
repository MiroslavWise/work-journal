import { useState } from "react"

import CreateLog from "./components/modal/create-log"
import EditLog from "./components/modal/edit-log"
import JournalTable from "./components/journal-table"
import ProviderCreateLog from "./provider/provider-create-log"
import ProviderEditLog from "./provider/provider-edit-log"
import type { IJournal } from "./interface/journal"

function App() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<IJournal | null>(null)

  const handleEdit = (entry: IJournal) => {
    setEditEntry(entry)
    setEditOpen(true)
  }

  const handleEditOpenChange = (value: boolean | ((prev: boolean) => boolean)) => {
    setEditOpen((prev) => {
      const next = typeof value === "function" ? value(prev) : value
      if (!next) {
        setEditEntry(null)
      }
      return next
    })
  }

  return (
    <ProviderCreateLog onOpenChange={setCreateOpen} open={createOpen}>
      <ProviderEditLog onOpenChange={handleEditOpenChange} open={editOpen}>
        <JournalTable onEdit={handleEdit} />
        <CreateLog onOpenChange={setCreateOpen} open={createOpen} />
        <EditLog entry={editEntry} onOpenChange={handleEditOpenChange} open={editOpen} />
      </ProviderEditLog>
    </ProviderCreateLog>
  )
}

export default App
