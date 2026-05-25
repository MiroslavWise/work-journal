import type { Dispatch, SetStateAction } from "react"

import FormEditLog from "../forms/form-edit-log"
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer"

import type { IJournal } from "~/interface/journal"

interface EditLogProps {
  entry: IJournal | null
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function EditLog({ entry, open, onOpenChange }: EditLogProps) {
  return (
    <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
      <DrawerHeader>
        <DrawerTitle>Редактирование записи</DrawerTitle>
        <DrawerDescription>{entry ? `Запись №${entry.id}` : "Измените данные записи в журнале"}</DrawerDescription>
      </DrawerHeader>
      <div className="no-scrollbar overflow-y-auto px-4">
        {open && entry && <FormEditLog entry={entry} onSuccess={() => onOpenChange(false)} />}
      </div>
    </DrawerContent>
  )
}

EditLog.displayName = "EditLog"
export default EditLog
