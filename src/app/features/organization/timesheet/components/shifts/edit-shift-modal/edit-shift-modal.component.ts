import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ShiftsService} from '../../../services/shifts.service';
import {Shift} from '../../../models/shift.model';
import {EditShiftRequest} from '../../../models/edit-shift-request.model';
import {ShiftType} from '../../../enums/shift-type.enum';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {CommonModule} from '@angular/common';
import {ColorPickerComponent} from '../../../../../../shared/components/color-picker/color-picker.component';
import {TimeFormatService} from '../../../../../../shared/services/time-format.service';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-edit-shift-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimepickerModule,
    ColorPickerComponent
  ],
  templateUrl: './edit-shift-modal.component.html',
  styleUrl: './edit-shift-modal.component.scss'
})
export class EditShiftModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private readonly timeFormatService = inject(TimeFormatService);
  private readonly shiftsService = inject(ShiftsService);
  bsModalRef = inject(BsModalRef);

  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    code: [
      '',
      [
        Validators.required,
        Validators.maxLength(10)
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    color: [
      '',
      [
        Validators.required,
        Validators.maxLength(7)
      ]
    ],
    type: [
      '',
      [
        Validators.required
      ]
    ],
    startTime: [
      this.timeFormatService.fromTimeSpanFormat(undefined)
    ],
    endTime: [
      this.timeFormatService.fromTimeSpanFormat(undefined)
    ]
  });

  shift?: Shift;

  request = signal<EditShiftRequest>({
    id: 0,
    description: '',
    code: '',
    color: '',
    type: ShiftType.none
  });

  selectedColor: string = '#FFFFFF';

  ngOnInit(): void {
    this.getShiftById();

    this.form.get('type')?.valueChanges
      .subscribe(value => {
        if (value === 'Workday') {
          this.form.get('startTime')?.setValidators([Validators.required]);
          this.form.get('endTime')?.setValidators([Validators.required]);
        } else {
          this.form.get('startTime')?.clearValidators();
          this.form.get('endTime')?.clearValidators();
        }

        this.form.get('startTime')?.updateValueAndValidity();
        this.form.get('endTime')?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getShiftById() {
    this.shiftsService.getShiftById(this.shift!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(shift => {
        this.updateFormWithShiftData(shift);

        this.selectedColor = shift.color;
      });
  }

  updateFormWithShiftData(shift: Shift) {
    this.form.patchValue({
      code: shift.code,
      description: shift.description,
      color: shift.color,
      type: shift.type,
      startTime: this.timeFormatService.fromTimeSpanFormat(shift.startTime),
      endTime: this.timeFormatService.fromTimeSpanFormat(shift.endTime)
    });
  }

  save() {
    if (!this.request)
      return;

    this.request.update(value => ({
      ...value,
      id: this.shift!.id,
      code: this.form.value.code,
      description: this.form.value.description,
      color: this.selectedColor,
      type: this.form.value.type,
    }))

    if (this.form.value.type === 'Workday') {
      this.request.update(value => ({
        ...value,
        startTime: this.timeFormatService.toTimeSpanFormat(this.form.value.startTime),
        endTime: this.timeFormatService.toTimeSpanFormat(this.form.value.endTime)
      }));
    } else {
      this.request.update(value => ({
        ...value,
        startTime: null,
        endTime: null,
      }));
    }

    this.shiftsService.updateShift(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (shift) => {
          this.bsModalRef.hide();
        },
        error: err => {
          console.error('updating shift error', err);
        }
      });
  }
}
