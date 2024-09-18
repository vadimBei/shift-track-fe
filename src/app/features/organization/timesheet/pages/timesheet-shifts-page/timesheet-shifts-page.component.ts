import { Component } from '@angular/core';
import { GoBackComponent } from '../../../../../shared/components/go-back/go-back.component';

@Component({
  selector: 'app-timesheet-shifts-page',
  standalone: true,
  imports: [
    GoBackComponent
  ],
  templateUrl: './timesheet-shifts-page.component.html',
  styleUrl: './timesheet-shifts-page.component.scss'
})
export class TimesheetShiftsPageComponent {

}
