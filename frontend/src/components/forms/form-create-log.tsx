import { useForm, type Resolver } from "react-hook-form"
import { resolver, type Schema } from "~/schemas/journal"

function FormCreateLog() {
  const { handleSubmit } = useForm<Schema>({
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

  return <form onSubmit={onSubmit}></form>
}

FormCreateLog.displayName = "FormCreateLog"
export default FormCreateLog
