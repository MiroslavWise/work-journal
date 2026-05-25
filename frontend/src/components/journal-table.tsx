import { parseAsInteger, useQueryState } from "nuqs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

import { cn } from "~/lib/utils"
import { getJournalEntries } from "~/api/get"
import type { IJournal } from "~/interface/journal"

const JOURNAL_PAGE_SIZE = 20

const skeletonColumns = [
  { id: "number", width: "w-8" },
  { id: "date", width: "w-24" },
  { id: "work-type", width: "w-44" },
  { id: "volume", width: "w-16" },
  { id: "unit", width: "w-12" },
  { id: "performer", width: "w-36" },
  { id: "actions", width: "w-16" },
] as const

const skeletonRowIds = Array.from({ length: JOURNAL_PAGE_SIZE }, (_, rowNumber) => `journal-skeleton-row-${rowNumber + 1}`)

const volumeFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
})

function JournalTableSkeletonRows() {
  return skeletonRowIds.map((rowId) => (
    <TableRow key={rowId}>
      {skeletonColumns.map((column) => (
        <TableCell key={column.id}>
          <Skeleton className={cn("h-5", column.width)} />
        </TableCell>
      ))}
    </TableRow>
  ))
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU")
}

function formatVolume(value: number) {
  return volumeFormatter.format(value)
}

type PageItem = { type: "page"; value: number } | { type: "ellipsis"; id: "leading" | "trailing" }

function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page" as const,
      value: index + 1,
    }))
  }

  const pages: PageItem[] = [{ type: "page", value: 1 }]

  if (current > 3) {
    pages.push({ type: "ellipsis", id: "leading" })
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let page = start; page <= end; page += 1) {
    pages.push({ type: "page", value: page })
  }

  if (current < total - 2) {
    pages.push({ type: "ellipsis", id: "trailing" })
  }

  pages.push({ type: "page", value: total })

  return pages
}

function JournalTable({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (entry: IJournal) => void
}) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const { data, isPending, isError } = useQuery({
    queryKey: ["journal-entries", page],
    queryFn: () => getJournalEntries(page),
    placeholderData: keepPreviousData,
  })

  const totalPages = data?.total_pages ?? 1
  const currentPage = data?.page ?? page

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-lg font-bold">Журнал учёта выполненных работ</h2>
        <Button type="button" variant="outline" onClick={onAdd}>
          Добавить запись
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Дата выполнения</TableHead>
            <TableHead>Вид работ</TableHead>
            <TableHead>Объём</TableHead>
            <TableHead>Ед. изм.</TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <JournalTableSkeletonRows />}

          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-destructive">
                Не удалось загрузить записи
              </TableCell>
            </TableRow>
          )}

          {!isPending && !isError && data?.items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Записей пока нет
              </TableCell>
            </TableRow>
          )}

          {!isPending &&
            !isError &&
            data?.items.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{formatDate(entry.completion_date)}</TableCell>
                <TableCell>{entry.work_type}</TableCell>
                <TableCell>{formatVolume(entry.volume)}</TableCell>
                <TableCell>{entry.unit}</TableCell>
                <TableCell>{entry.performer_name}</TableCell>
                <TableCell>
                  <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                    Изменить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableCaption>
          Журнал учёта выполненных работ
          {data ? ` · всего ${data.total}` : ""}
        </TableCaption>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Назад"
                href="#"
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage > 1) {
                    void setPage(currentPage - 1)
                  }
                }}
              />
            </PaginationItem>

            {getPageNumbers(currentPage, totalPages).map((item) =>
              item.type === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${item.id}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item.value}>
                  <PaginationLink
                    href="#"
                    isActive={item.value === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      void setPage(item.value)
                    }}
                  >
                    {item.value}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                text="Вперёд"
                href="#"
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage < totalPages) {
                    void setPage(currentPage + 1)
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

JournalTable.displayName = "JournalTable"
export default JournalTable
