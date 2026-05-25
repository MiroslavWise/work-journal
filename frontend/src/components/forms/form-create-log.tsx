import { Controller, useForm, type Resolver } from "react-hook-form"
import { resolver, type Schema } from "~/schemas/journal"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"

function FormCreateLog() {
  const { handleSubmit, control } = useForm<Schema>({
    resolver: resolver as Resolver<Schema>,
    defaultValues: {
      completion_date: new Date().toISOString().split("T")[0],
      work_type: "",
      volume: 0,
      unit: "",
      performer_name: "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          control={control}
          name="completion_date"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Дата выполнения</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}

FormCreateLog.displayName = "FormCreateLog"
export default FormCreateLog
