import { Component, Input  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {
  @Input() itemName: string = '';
  @Input() entityName: string = '';
  onConfirm!: () => void;

  constructor(private modalRef: BsModalRef) {}

  confirm(): void {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}
