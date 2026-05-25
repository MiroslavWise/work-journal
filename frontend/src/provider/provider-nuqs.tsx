import type { PropsWithChildren } from "react"
import { NuqsAdapter } from "nuqs/adapters/react"

export default ({ children }: PropsWithChildren) => <NuqsAdapter>{children}</NuqsAdapter>
