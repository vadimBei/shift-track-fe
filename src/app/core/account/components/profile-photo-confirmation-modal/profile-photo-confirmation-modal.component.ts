import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-profile-photo-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile-photo-confirmation-modal.component.html',
  styleUrl: './profile-photo-confirmation-modal.component.scss'
})
export class ProfilePhotoConfirmationModalComponent {
  @Output() onClose = new EventEmitter<File>();

  imageUrl: SafeUrl | null = null;
  private imageFile: File | null = null;

  constructor(
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer
  ) {
  }

  setImage(file: File) {
    this.imageFile = file;
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  hideModal() {
    this.modalRef.hide();
  }

  save() {
    if (this.imageFile) {
      this.onClose.emit(this.imageFile);
      this.modalRef.hide();
    }
  }
}
