"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) pages.push(p)
    else if (pages[pages.length - 1] !== "...") pages.push("...")
  }
  return pages
}

// Paginación con el componente Pagination de shadcn/ui
export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const go = (e: React.MouseEvent, target: number) => {
    e.preventDefault()
    if (target >= 1 && target <= totalPages) onPageChange(target)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => go(e, page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`dots-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} onClick={(e) => go(e, p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => go(e, page + 1)}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
