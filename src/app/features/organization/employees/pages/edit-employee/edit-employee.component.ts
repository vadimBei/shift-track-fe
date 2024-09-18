import { Component } from '@angular/core';
import { GoBackComponent } from '../../../../../shared/components/go-back/go-back.component';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    GoBackComponent
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent {

}
