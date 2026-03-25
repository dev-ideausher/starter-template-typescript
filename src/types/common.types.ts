export interface PopulateOptions {
  path: string;
  select?: string;
  populate?: PopulateOptions | PopulateOptions[] | string;
}

export type PopulateParam = string | PopulateOptions | PopulateOptions[];

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  populate?: PopulateParam;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
