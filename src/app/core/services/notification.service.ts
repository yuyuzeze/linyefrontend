import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse, MessageContainer } from '../models/api-response.model';
import { unwrapApiResponse } from '../utils/api-response.util';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  handleMessages(messages?: MessageContainer | null): void {
    if (!messages) {
      return;
    }

    for (const item of messages.nrmList ?? []) {
      this.toastr.success(item.message, item.code || '情報');
    }
    for (const item of messages.wrnList ?? []) {
      this.toastr.warning(item.message, item.code || '警告');
    }
    for (const item of messages.errList ?? []) {
      this.toastr.error(item.message, item.code || 'エラー');
    }
  }

  /** ApiResponse から result を取り出し、nrm/wrn/err トーストを表示する。 */
  unwrap<T>(response: ApiResponse<T>): T {
    this.handleMessages(response.messages);
    return unwrapApiResponse(response);
  }

  showError(message: string, title = 'エラー'): void {
    this.toastr.error(message, title);
  }
}
