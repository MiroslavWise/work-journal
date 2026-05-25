import type { Dispatch, PropsWithChildren, SetStateAction } from "react"

import { Drawer } from "~/components/ui/drawer"

export default ({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<{ open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> }>) => {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  )
}
