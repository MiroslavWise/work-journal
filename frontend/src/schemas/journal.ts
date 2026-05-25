import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { journalUnitValues } from "~/constants/journal-units"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const schema = yup.object({
  completion_date: yup
    .string()
    .trim()
    .required("Укажите дату выполнения")
    .matches(datePattern, "Дата должна быть в формате ГГГГ-ММ-ДД")
    .test("valid-date", "Некорректная дата", (value) => {
      if (!value) return false

      const [year, month, day] = value.split("-").map(Number)
      const date = new Date(year, month - 1, day)

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      )
    }),
  work_type: yup
    .string()
    .trim()
    .required("Укажите вид работ"),
  volume: yup
    .number()
    .typeError("Объём должен быть числом")
    .required("Укажите объём")
    .min(0, "Объём не может быть отрицательным"),
  unit: yup
    .string()
    .oneOf([...journalUnitValues], "Выберите единицу измерения")
    .required("Укажите единицу измерения"),
  performer_name: yup
    .string()
    .trim()
    .required("Укажите ФИО исполнителя"),
})

export const resolver = yupResolver(schema)
export type Schema = yup.InferType<typeof schema>

export type CreateJournalEntryPayload = Schema
