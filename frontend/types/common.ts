export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FileWithPreview extends File {
  preview?: string;
} 