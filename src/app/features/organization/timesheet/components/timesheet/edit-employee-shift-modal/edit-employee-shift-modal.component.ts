import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Employee} from "../../../../employees/models/employee.model";
import {DatePipe} from "@angular/common";
import {ShiftsService} from "../../../services/shifts.service";
import {Shift} from "../../../models/shift.model";
import {Subject, takeUntil} from "rxjs";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-edit-employee-shift-modal',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './edit-employee-shift-modal.component.html',
  styleUrl: './edit-employee-shift-modal.component.scss'
})
export class EditEmployeeShiftModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  bsModalRef = inject(BsModalRef);

  private readonly shiftsService = inject(ShiftsService);
  private fb = inject(FormBuilder);

  shifts = signal<Shift[]>([]);
  employee?: Employee;
  employeeShiftDate?: Date;
  // shiftId?: number;
  form: FormGroup = this.fb.group(
    {
      shiftId: [null, [Validators.required]],
      dateFrom: [new Date(), [Validators.required]],
      dateTo: [new Date(), [Validators.required]]
    },
    {
      validators: this.dateRangeValidator
    });


  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const dateFrom = control.get('dateFrom')?.value;
    const dateTo = control.get('dateTo')?.value;

    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      if (from > to) {
        return {dateRange: true};
      }
    }

    return null;
  }

  ngOnInit(): void {
    this.getShifts();
  }

  getShifts() {

    this.shiftsService.getShifts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(shifts => {
        this.shifts.set(shifts);
      })
  }

  save() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
