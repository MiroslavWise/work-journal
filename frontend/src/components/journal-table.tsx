import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, useQueryState } from "nuqs"

import { getJournalEntries } from "~/api/get"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU")
}

function formatVolume(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value)
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages: (number | "ellipsis")[] = [1]

  if (current > 3) {
    pages.push("ellipsis")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (current < total - 2) {
    pages.push("ellipsis")
  }

  pages.push(total)

  return pages
}

export function JournalTable() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const { data, isLoading, isError } = useQuery({
    queryKey: ["journal-entries", page],
    queryFn: () => getJournalEntries(page),
  })

  const totalPages = data?.total_pages ?? 1
  const currentPage = data?.page ?? page

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Дата выполнения</TableHead>
            <TableHead>Вид работ</TableHead>
            <TableHead>Объём</TableHead>
            <TableHead>Ед. изм.</TableHead>
            <TableHead>Исполнитель</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Загрузка...
              </TableCell>
            </TableRow>
          )}

          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-destructive">
                Не удалось загрузить записи
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !isError && data?.items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Записей пока нет
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            !isError &&
            data?.items.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{formatDate(entry.completion_date)}</TableCell>
                <TableCell>{entry.work_type}</TableCell>
                <TableCell>{formatVolume(entry.volume)}</TableCell>
                <TableCell>{entry.unit}</TableCell>
                <TableCell>{entry.performer_name}</TableCell>
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
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage > 1) {
                    void setPage(currentPage - 1)
                  }
                }}
              />
            </PaginationItem>

            {getPageNumbers(currentPage, totalPages).map((pageNumber, index) =>
              pageNumber === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      void setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                text="Вперёд"
                href="#"
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
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
