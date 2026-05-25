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

  const handleAdd = () => {
    setEditOpen(false)
    setEditEntry(null)
    setCreateOpen(true)
  }

  const handleEdit = (entry: IJournal) => {
    setCreateOpen(false)
    setEditEntry(entry)
    setEditOpen(true)
  }

  const handleCreateOpenChange = (value: boolean | ((prev: boolean) => boolean)) => {
    setCreateOpen(value)
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
    <>
      <JournalTable onAdd={handleAdd} onEdit={handleEdit} />

      <ProviderCreateLog onOpenChange={handleCreateOpenChange} open={createOpen}>
        <CreateLog onOpenChange={handleCreateOpenChange} open={createOpen} />
      </ProviderCreateLog>

      <ProviderEditLog onOpenChange={handleEditOpenChange} open={editOpen}>
        <EditLog entry={editEntry} onOpenChange={handleEditOpenChange} open={editOpen} />
      </ProviderEditLog>
    </>
  )
}

export default App
