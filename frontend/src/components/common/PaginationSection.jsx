import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationSection({ page, totalPages, setPage }) {
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => {
                            if (page > 1) {
                                setPage(page - 1);
                            }
                        }}


                    />
                </PaginationItem>
                <span className="sm:hidden text-sm text-gray-600">
                    Page {page} / {totalPages}
                </span>
                {(() => {
                    const maxVisible = 7; // Độ lớn tối đa của các trang
                    const pages = [];

                    // Nếu tổng số trang nhỏ hơn hoặc bằng maxVisible
                    if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                        }
                    } else { // Nếu tổng số trang lớn hơn maxVisible
                        pages.push(1);
                        let start = Math.max(2, page - 1);
                        let end = Math.min(totalPages - 1, page + 1);

                        if (start > 2) { // Nếu trang đầu tiên lớn hơn 2
                            pages.push('...');
                        }
                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }
                        if (end < totalPages - 1) { // Nếu trang cuối cùng nhỏ hơn tổng số trang - 1
                            pages.push('...');
                        }
                        pages.push(totalPages);
                    }

                    return pages.map((pageNum, index) => {
                        if (pageNum === '...') {
                            return (
                                <PaginationItem className="hidden sm:block" key={`ellipsis-${index}`}>
                                    <span className="px-4 py-2">...</span>
                                </PaginationItem>
                            );
                        }
                        return (
                            <PaginationItem className="hidden sm:block" key={pageNum}>
                                <PaginationLink
                                    isActive={page === pageNum}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    });
                })()}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => {
                            if (page < totalPages) {
                                setPage(page + 1);
                            }
                        }}



                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
}
