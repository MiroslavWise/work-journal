import { DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"

function CreateLog() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Создание записи</DrawerTitle>
      </DrawerHeader>
    </DrawerContent>
  )
}

CreateLog.displayName = "CreateLog"
export default CreateLog
