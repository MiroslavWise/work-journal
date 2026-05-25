import type { PropsWithChildren } from "react"
import { Drawer } from "~/components/ui/drawer"

export default ({ children }: PropsWithChildren) => {
  return <Drawer direction="right">{children}</Drawer>
}
