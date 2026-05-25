import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { Controller, type Control } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

import { cn } from "~/lib/utils"
import type { Schema } from "~/schemas/journal"
import { formatApiDate, parseApiDate } from "~/lib/date"

interface JournalCompletionDateFieldProps {
  control: Control<Schema>
}

function JournalCompletionDateField({ control }: JournalCompletionDateFieldProps) {
  return (
    <Controller
      control={control}
      name="completion_date"
      render={({ field, fieldState }) => {
        const selectedDate = parseApiDate(field.value)

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Дата выполнения</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  id={field.name}
                  name={field.name}
                  data-empty={!selectedDate}
                  aria-invalid={fieldState.invalid}
                  className={cn("w-full justify-between text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  {selectedDate ? format(selectedDate, "PPP", { locale: ru }) : "Выберите дату"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  locale={ru}
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ? formatApiDate(date) : "")
                  }}
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

JournalCompletionDateField.displayName = "JournalCompletionDateField"
export default JournalCompletionDateField
