export const JournalUnit = {
  CubicMeter: "м³",
  SquareMeter: "м²",
  LinearMeter: "п.м.",
  Meter: "м",
  Ton: "т",
  Kilogram: "кг",
  Liter: "л",
  Piece: "шт",
  Set: "компл",
  ManHour: "чел.-ч",
  MachineHour: "маш.-ч",
} as const

export type JournalUnit = (typeof JournalUnit)[keyof typeof JournalUnit]

export const journalUnitValues: JournalUnit[] = Object.values(JournalUnit)

export const journalUnitOptions = [
  { value: JournalUnit.CubicMeter, label: "м³ — кубические метры" },
  { value: JournalUnit.SquareMeter, label: "м² — квадратные метры" },
  { value: JournalUnit.LinearMeter, label: "п.м. — погонные метры" },
  { value: JournalUnit.Meter, label: "м — метры" },
  { value: JournalUnit.Ton, label: "т — тонны" },
  { value: JournalUnit.Kilogram, label: "кг — килограммы" },
  { value: JournalUnit.Liter, label: "л — литры" },
  { value: JournalUnit.Piece, label: "шт — штуки" },
  { value: JournalUnit.Set, label: "компл — комплекты" },
  { value: JournalUnit.ManHour, label: "чел.-ч — человеко-часы" },
  { value: JournalUnit.MachineHour, label: "маш.-ч — машино-часы" },
] as const

export function isJournalUnit(value: string): value is JournalUnit {
  return journalUnitValues.includes(value as JournalUnit)
}
