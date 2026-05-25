import { createRoot } from "react-dom/client"

import App from "./App.tsx"
import ProviderNuqs from "./provider/provider-nuqs"
import ProviderQuery from "./provider/provider-query"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <ProviderNuqs>
    <ProviderQuery>
      <App />
    </ProviderQuery>
  </ProviderNuqs>,
)
