import type { Dispatch, SetStateAction } from "react"

import FormCreateLog from "../forms/form-create-log"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer"

interface IProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function CreateLog({ open, onOpenChange }: IProps) {
  return (
    <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
      <DrawerHeader>
        <DrawerTitle>Создание записи</DrawerTitle>
        <DrawerDescription>Создайте новую запись в журнале учёта выполненных работ</DrawerDescription>
      </DrawerHeader>
      <div className="no-scrollbar overflow-y-auto px-4">{open && <FormCreateLog onSuccess={() => onOpenChange(false)} />}</div>
    </DrawerContent>
  )
}

CreateLog.displayName = "CreateLog"
export default CreateLog
