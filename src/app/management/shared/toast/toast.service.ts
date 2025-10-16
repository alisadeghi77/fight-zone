import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  header?: string;
  text: string;
  delayMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private readonly defaultDelayMs = 4000;

  public toasts$ = new Subject<ToastMessage[]>();
  private current: ToastMessage[] = [];

  show(type: ToastType, text: string, header?: string, delayMs?: number): void {
    const toast: ToastMessage = {
      id: ++this.counter,
      type,
      header,
      text,
      delayMs: delayMs ?? this.defaultDelayMs
    };
    this.current = [...this.current, toast];
    this.toasts$.next(this.current);
  }

  success(text: string, header: string = 'موفق'): void {
    this.show('success', text, header);
  }

  error(text: string, header: string = 'خطا'): void {
    this.show('error', text, header, 6000);
  }

  info(text: string, header: string = 'اطلاعات'): void {
    this.show('info', text, header);
  }

  warning(text: string, header: string = 'هشدار'): void {
    this.show('warning', text, header);
  }

  dismiss(id: number): void {
    this.current = this.current.filter(t => t.id !== id);
    this.toasts$.next(this.current);
  }
}


