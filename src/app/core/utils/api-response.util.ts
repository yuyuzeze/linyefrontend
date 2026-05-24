import { ApiResponse } from '../models/api-response.model';

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  const errors = response.messages?.errList ?? [];
  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(' '));
  }

  if (response.result === null || response.result === undefined) {
    if (response.statusCode === 204) {
      return null as T;
    }
    throw new Error(response.statusDetailMessage ?? 'API が空の結果を返しました。');
  }

  return response.result;
}
