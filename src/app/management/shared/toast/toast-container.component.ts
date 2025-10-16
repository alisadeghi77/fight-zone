import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  template: `
  <div class="toast-container position-fixed p-3" style="z-index: 1080; inset: auto 0 0 auto;">
    <ngb-toast *ngFor="let t of toasts" 
               [class.bg-success]="t.type==='success'"
               [class.bg-danger]="t.type==='error'"
               [class.bg-warning]="t.type==='warning'"
               [class.bg-info]="t.type==='info'"
               [autohide]="true"
               [delay]="t.delayMs || 5000"
               (hidden)="dismiss(t.id)"
               header="{{t.header || ''}}">
      <span class="text-white">{{ t.text }}</span>
    </ngb-toast>
  </div>
  `
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private sub?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe(list => this.toasts = list);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}


