import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, type Resolver } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FieldGroup } from "~/components/ui/field"
import JournalEntryFields from "~/components/forms/fields/journal-entry-fields"

import { updateJournalEntry } from "~/api/patch"
import type { IJournal } from "~/interface/journal"
import { journalEntryToSchema } from "~/lib/journal-form"
import { resolver, type Schema } from "~/schemas/journal"

interface FormEditLogProps {
  entry: IJournal
  onSuccess: () => void
}

function FormEditLog({ entry, onSuccess }: FormEditLogProps) {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<Schema>({
    resolver: resolver as Resolver<Schema>,
    values: journalEntryToSchema(entry),
  })

  const mutation = useMutation({
    mutationFn: (data: Schema) => updateJournalEntry(entry.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["journal-entries"] })
      onSuccess()
    },
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <form className="flex flex-col gap-6 pb-4" onSubmit={onSubmit}>
      <FieldGroup>
        <JournalEntryFields control={control} />
      </FieldGroup>

      {mutation.isError && <p className="text-sm text-destructive">Не удалось обновить запись</p>}

      <Button disabled={isSubmitting || mutation.isPending} type="submit">
        {mutation.isPending ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </form>
  )
}

FormEditLog.displayName = "FormEditLog"
export default FormEditLog
