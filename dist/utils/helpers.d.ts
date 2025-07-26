export declare function generateRandomString(length: number): string;
export declare function formatDate(date: Date): string;
export declare function formatDateForAPI(date: Date | string | undefined): string | null;
export declare function isValidEmail(email: string): boolean;
export declare function sanitizeInput(input: string): string;
export declare function generatePagination(page: number, limit: number, total: number): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
};
