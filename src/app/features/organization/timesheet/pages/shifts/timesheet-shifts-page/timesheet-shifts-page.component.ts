import { Component, inject } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Shift } from '../../../models/shift.model';
import { ShiftsService } from '../../../services/shifts.service';
import { DeleteConfirmationModalComponent } from '../../../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EditShiftModalComponent } from '../../../components/shifts/edit-shift-modal/edit-shift-modal.component';
import { CreateShiftModalComponent } from '../../../components/shifts/create-shift-modal/create-shift-modal.component';
import { TimeSpanHoursMinutesFormatPipe } from '../../../../../../shared/pipes/time-span-hours-minutes-format.pipe';

@Component({
  selector: 'app-timesheet-shifts-page',
  standalone: true,
  imports: [
    CommonModule,
    GoBackComponent,
    TimeSpanHoursMinutesFormatPipe
  ],
  templateUrl: './timesheet-shifts-page.component.html',
  styleUrl: './timesheet-shifts-page.component.scss'
})
export class TimesheetShiftsPageComponent {
  shifts$: Subject<Shift[]> = new Subject<Shift[]>();
  readonly modalService = inject(BsModalService);
  readonly shiftsService = inject(ShiftsService);

  ngOnInit(): void {
    this.getShifts();
  }

  getShifts() {
    this.shiftsService.getShifts()
      .subscribe(shifts => {
        this.shifts$.next(shifts);
      })
  }

  openCreateShiftModal() {
    const ref = this.modalService.show(
      CreateShiftModalComponent,
      {
        class: 'modal modal-dialog-centered',
      });

    ref.onHidden?.subscribe({
      next: () => this.getShifts()
    });
  }

  openEditShiftModal(shift: Shift) {
    const ref = this.modalService.show(
      EditShiftModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          shift: shift
        }
      });

    ref.onHidden?.subscribe({
      next: () => this.getShifts()
    });
  }


  openDeleteConfirmation(shift: Shift) {
    this.modalService.show(
      DeleteConfirmationModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          itemName: shift.code,
          entityName: 'зміну',
          onConfirm: () => this.deleteShift(shift.id)
        }
      });
  }

  deleteShift(shiftId: number) {
    this.shiftsService.deleteShift(shiftId)
      .subscribe({
        next: () => this.getShifts()
      });
  }
}
