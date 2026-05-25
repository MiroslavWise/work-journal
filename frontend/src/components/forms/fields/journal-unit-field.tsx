import { Controller, type Control } from "react-hook-form"

import { journalUnitOptions } from "~/constants/journal-units"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import type { Schema } from "~/schemas/journal"

interface JournalUnitFieldProps {
  control: Control<Schema>
}

function JournalUnitField({ control }: JournalUnitFieldProps) {
  return (
    <Controller
      control={control}
      name="unit"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Ед. изм.</FieldLabel>
          <Select value={field.value || undefined} onValueChange={field.onChange}>
            <SelectTrigger
              id={field.name}
              className="w-full"
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder="Выберите единицу" />
            </SelectTrigger>
            <SelectContent>
              {journalUnitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

JournalUnitField.displayName = "JournalUnitField"
export default JournalUnitField
