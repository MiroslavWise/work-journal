import type { Dispatch, SetStateAction } from "react"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer"
import FormCreateLog from "../forms/form-create-log"

interface IProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function CreateLog({ open }: IProps) {
  return (
    <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
      <DrawerHeader>
        <DrawerTitle>Создание записи</DrawerTitle>
        <DrawerDescription>Создайте новую запись в журнале учёта выполненных работ</DrawerDescription>
      </DrawerHeader>
      <div className="no-scrollbar overflow-y-auto px-4">{open && <FormCreateLog />}</div>
    </DrawerContent>
  )
}

CreateLog.displayName = "CreateLog"
export default CreateLog
