import { useQuery } from "@tanstack/react-query"
import { parseAsIndex, useQueryState } from "nuqs"
import { useEffect } from "react"
import { getJournalEntries } from "./api/get"

function App() {
  const [page] = useQueryState("page", parseAsIndex.withDefault(1))

  const { data } = useQuery({
    queryKey: ["journal-entries", page],
    queryFn: () => getJournalEntries(page),
  })

  useEffect(() => {
    void fetch("/api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Health check failed: ${res.status}`)
        }
        return res.json() as Promise<{ status: string }>
      })
      .then((data) => {
        console.log("Backend health:", data.status)
      })
      .catch((error: unknown) => {
        console.error("Backend health check error:", error)
      })
  }, [])

  useEffect(() => {
    if (data) {
      console.log("Journal entries:", data)
    }
  }, [])

  return <></>
}

export default App
