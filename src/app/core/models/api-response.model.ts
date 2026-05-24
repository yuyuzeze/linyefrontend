export interface ApiMessageItem {
  code: string;
  message: string;
}

export interface MessageContainer {
  nrmList: ApiMessageItem[];
  wrnList: ApiMessageItem[];
  errList: ApiMessageItem[];
}

export interface ApiResponse<T> {
  result: T | null;
  messages: MessageContainer;
  statusDetailMessage?: string | null;
  statusCode: number;
}
