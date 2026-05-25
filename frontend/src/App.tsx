import CreateLog from "./components/modal/create-log"
import JournalTable from "./components/journal-table"
import ProviderCreateLog from "./provider/provider-create-log"
import { useState } from "react"

function App() {
  const [open, setOpen] = useState(false)

  return (
    <ProviderCreateLog onOpenChange={setOpen} open={open}>
      <JournalTable />
      <CreateLog open={open} onOpenChange={setOpen} />
    </ProviderCreateLog>
  )
}

export default App
