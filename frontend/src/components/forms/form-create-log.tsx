import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm, type Control, type Resolver } from "react-hook-form"

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

import { cn } from "~/lib/utils"
import { createJournalEntry } from "~/api/post"
import { formatApiDate, parseApiDate } from "~/lib/date"
import { resolver, type Schema } from "~/schemas/journal"

interface FormCreateLogProps {
  onSuccess: () => void
}

const defaultValues = {
  completion_date: formatApiDate(new Date()),
  work_type: "",
  unit: "",
  performer_name: "",
} as Schema

function FormTextField({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: {
  control: Control<Schema>
  name: "work_type" | "unit" | "performer_name"
  label: string
  placeholder?: string
  type?: React.ComponentProps<typeof Input>["type"]
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ""}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function FormCreateLog({ onSuccess }: FormCreateLogProps) {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<Schema>({
    resolver: resolver as Resolver<Schema>,
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: createJournalEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["journal-entries"] })
      reset(defaultValues)
      onSuccess()
    },
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <form className="flex flex-col gap-6 pb-4" onSubmit={onSubmit}>
      <FieldGroup>
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

        <FormTextField control={control} name="work_type" label="Вид работ" placeholder="Кладка перегородок" />

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

        <FormTextField control={control} name="unit" label="Ед. изм." placeholder="м³" />

        <FormTextField control={control} name="performer_name" label="Исполнитель" placeholder="Иванов Иван Иванович" />
      </FieldGroup>

      {mutation.isError && <p className="text-sm text-destructive">Не удалось сохранить запись</p>}

      <Button disabled={isSubmitting || mutation.isPending} type="submit">
        {mutation.isPending ? "Сохранение..." : "Сохранить"}
      </Button>
    </form>
  )
}

FormCreateLog.displayName = "FormCreateLog"
export default FormCreateLog
