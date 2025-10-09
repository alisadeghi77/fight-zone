import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() message: string = 'آیا مطمئن هستید؟';
  @Input() confirmText: string = 'بله';
  @Input() cancelText: string = 'خیر';

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss(false);
  }
}

