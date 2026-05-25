import type { Control } from "react-hook-form"

import type { Schema } from "~/schemas/journal"
import JournalCompletionDateField from "./journal-completion-date-field"
import JournalUnitField from "./journal-unit-field"
import JournalTextField from "./journal-text-field"
import JournalVolumeField from "./journal-volume-field"

interface JournalEntryFieldsProps {
  control: Control<Schema>
}

function JournalEntryFields({ control }: JournalEntryFieldsProps) {
  return (
    <>
      <JournalCompletionDateField control={control} />
      <JournalTextField control={control} name="work_type" label="Вид работ" placeholder="Кладка перегородок" />
      <JournalVolumeField control={control} />
      <JournalUnitField control={control} />
      <JournalTextField control={control} name="performer_name" label="Исполнитель" placeholder="Иванов Иван Иванович" />
    </>
  )
}

JournalEntryFields.displayName = "JournalEntryFields"
export default JournalEntryFields
