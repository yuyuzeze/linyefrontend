/** 一覧画面共通のページング */
export interface PaginationRequest {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
