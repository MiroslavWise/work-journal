import { Controller, type Control } from "react-hook-form"

import { Input } from "~/components/ui/input"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"

import type { Schema } from "~/schemas/journal"

interface JournalVolumeFieldProps {
  control: Control<Schema>
}

function JournalVolumeField({ control }: JournalVolumeFieldProps) {
  return (
    <Controller
      control={control}
      name="volume"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Объём</FieldLabel>
          <Input
            id={field.name}
            name={field.name}
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            placeholder="24"
            aria-invalid={fieldState.invalid}
            value={Number.isFinite(field.value) ? field.value : ""}
            onBlur={field.onBlur}
            ref={field.ref}
            onChange={(event) => {
              const { value } = event.target
              field.onChange(value === "" ? undefined : Number(value))
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

JournalVolumeField.displayName = "JournalVolumeField"
export default JournalVolumeField
