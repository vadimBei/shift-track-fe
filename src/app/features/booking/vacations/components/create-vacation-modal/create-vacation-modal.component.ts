import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-create-vacation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-vacation-modal.component.html',
  styleUrl: './create-vacation-modal.component.scss'
})
export class CreateVacationModalComponent {
  bsModalRef = inject(BsModalRef);
}
