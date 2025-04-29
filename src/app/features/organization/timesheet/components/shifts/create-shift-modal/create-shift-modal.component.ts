import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateShiftRequest} from '../../../models/create-shift-request.model';
import {ShiftType} from '../../../enums/shift-type.enum';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {CommonModule} from '@angular/common';
import {ShiftsService} from '../../../services/shifts.service';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {FormsModule} from '@angular/forms';
import {ColorPickerComponent} from '../../../../../../shared/components/color-picker/color-picker.component';
import {TimeFormatService} from '../../../../../../shared/services/time-format.service';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-create-shift-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimepickerModule,
    FormsModule,
    ColorPickerComponent
  ],
  templateUrl: './create-shift-modal.component.html',
  styleUrl: './create-shift-modal.component.scss'
})
export class CreateShiftModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private readonly timeFormatService = inject(TimeFormatService);
  private readonly shiftsService = inject(ShiftsService);

  readonly bsModalRef = inject(BsModalRef);

  selectedColor: string = '#FFFFFF';

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
      this.selectedColor,
      [
        Validators.required,
        Validators.maxLength(7)
      ]
    ],
    type: [
      null,
      [
        Validators.required
      ]
    ],
    startTime: [
      null,
      []
    ],
    endTime: [
      null,
      []
    ]
  });

  request = signal<CreateShiftRequest>(
    {
      description: '',
      code: '',
      color: '',
      type: ShiftType.none
    });

  ngOnInit(): void {
    this.form.get('type')?.valueChanges.subscribe(value => {
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

  save() {
    if (!this.request)
      return;

    this.request.update(value => ({
      ...value,
      code: this.form.value.code,
      description: this.form.value.description,
      color: this.selectedColor,
      type: this.form.value.type
    }));

    if (this.form.value.type === 'Workday') {
      this.request.update(value => ({
        ...value,
        startTime: this.timeFormatService.toTimeSpanFormat(this.form.value.startTime),
        endTime: this.timeFormatService.toTimeSpanFormat(this.form.value.endTime)
      }));
    }

    this.shiftsService.createShift(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (shift) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('creating shift error', error);
        }
      });
  }
}
