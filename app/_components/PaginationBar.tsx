"use client";

import { PageOption } from "@/app/_types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBarProps {
  pageOption: PageOption;
  page: string;
  showEdges?: boolean;
  siblingCount?: number;
}

export default function PaginationBar({
  pageOption,
  page,
  showEdges = true,
  siblingCount = 1,
}: PaginationBarProps) {
  const { currentPage, totalPages } = pageOption;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/${page}?${params.toString()}`);
  };

  const generatePages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(currentPage);

    for (let i = siblingCount; i >= 1; i--) {
      const leftPage = currentPage - i;
      if (leftPage >= 1) {
        pages.unshift(leftPage);
      }
    }

    for (let i = 1; i <= siblingCount; i++) {
      const rightPage = currentPage + i;
      if (rightPage < totalPages) {
        pages.push(rightPage);
      }
    }

    if (showEdges) {
      if (!pages.includes(1)) {
        pages.unshift(1);
      }

      const secondNumber = pages[1];
      if (typeof secondNumber === "number" && secondNumber > 2) {
        pages.splice(1, 0, "ellipsis");
      }

      if (currentPage + siblingCount < totalPages - 1) {
        pages.push("ellipsis", totalPages);
      } else if (currentPage + siblingCount === totalPages - 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {generatePages().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (page !== currentPage) {
                    handlePageChange(page as number);
                  }
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
