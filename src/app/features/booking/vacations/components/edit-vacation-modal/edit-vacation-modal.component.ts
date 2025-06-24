import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {Vacation} from "../../models/vacation.model";

@Component({
  selector: 'app-edit-vacation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-vacation-modal.component.html',
  styleUrl: './edit-vacation-modal.component.scss'
})
export class EditVacationModalComponent {
  bsModalRef = inject(BsModalRef);

  vacation?: Vacation;
}
