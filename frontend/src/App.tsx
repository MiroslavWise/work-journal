import CreateLog from "./components/modal/create-log"
import JournalTable from "./components/journal-table"
import ProviderCreateLog from "./provider/provider-create-log"

function App() {
  return (
    <ProviderCreateLog>
      <JournalTable />
      <CreateLog />
    </ProviderCreateLog>
  )
}

export default App
