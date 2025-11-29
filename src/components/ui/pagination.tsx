import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showMore?: boolean;
  onShowMore?: () => void;
  isLoadingMore?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      showMore = false,
      onShowMore,
      isLoadingMore = false,
      pageSize = 10,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 50, 100],
      totalItems,
      className,
    },
    ref
  ) => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    if (showMore) {
      return (
        <div
          ref={ref}
          className={cn("flex justify-center items-center mt-6", className)}
        >
          <Button
            variant="ghost"
            onClick={onShowMore}
            disabled={isLoadingMore}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium"
          >
            <Plus className="w-5 h-5 mr-1" />
            {isLoadingMore ? "Loading..." : "Show More"}
          </Button>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 flex-wrap",
          className
        )}
      >
        {/* Left side: Page size selector and info */}
        <div className="flex items-center gap-3">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          )}
          {totalItems !== undefined && (
            <span className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)}{" "}
              to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              entries
            </span>
          )}
        </div>

        {/* Center: Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className={cn(
              "h-9 px-3 border-gray-200 hover:bg-gray-50",
              !canGoPrevious && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-400 text-sm"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    "h-9 w-9 text-sm font-medium",
                    isActive
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={cn(
              "h-9 px-3 border-gray-200 hover:bg-gray-50",
              !canGoNext && "opacity-50 cursor-not-allowed"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Right side: Empty for balance */}
        {/* <div className="w-[200px] hidden lg:block"></div> */}
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
