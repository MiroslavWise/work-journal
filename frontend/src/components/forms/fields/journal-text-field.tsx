import { Controller, type Control } from "react-hook-form"

import { Input } from "~/components/ui/input"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"

import type { Schema } from "~/schemas/journal"

type JournalTextFieldName = "work_type" | "performer_name"

interface JournalTextFieldProps {
  control: Control<Schema>
  name: JournalTextFieldName
  label: string
  placeholder?: string
}

function JournalTextField({ control, name, label, placeholder }: JournalTextFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input {...field} id={field.name} placeholder={placeholder} aria-invalid={fieldState.invalid} value={field.value ?? ""} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

JournalTextField.displayName = "JournalTextField"
export default JournalTextField
