import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ShiftsService } from '../../../services/shifts.service';
import { Shift } from '../../../models/shift.model';
import { EditShiftRequest } from '../../../models/edit-shift-request.model';
import { ShiftType } from '../../../enums/shift-type.enum';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from '../../../../../../shared/components/color-picker/color-picker.component';
import { TimeFormatService } from '../../../../../../shared/services/time-format.service';

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
export class EditShiftModalComponent {
  timeFormatService = inject(TimeFormatService);
  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});
  bsModalRef = inject(BsModalRef);

  shiftsService = inject(ShiftsService);
  shift?: Shift;

  request?: EditShiftRequest;

  selectedColor: string = '#FFFFFF';

  ngOnInit(): void {
    this.request = {
      id: 0,
      description: '',
      code: '',
      color: '',
      type: ShiftType.none
    }

    this.getShiftById();

    this.initializeForm(this.shift!);
  }

  getShiftById() {
    this.shiftsService.getShiftById(this.shift!.id)
      .subscribe(shift => {
        this.shift = shift;

        this.selectedColor = shift.color;
      });
  }

  initializeForm(shift: Shift) {
    this.form = this.fb.group({
      code: [
        shift.code,
        [
          Validators.required,
          Validators.maxLength(10)
        ]
      ],
      description: [
        shift.description,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      color: [
        shift.color,
        [
          Validators.required,
          Validators.maxLength(7)
        ]
      ],
      type: [
        shift.type,
        [
          Validators.required
        ]
      ],
      startTime: [
        this.timeFormatService.fromTimeSpanFormat(shift.startTime),
        []
      ],
      endTime: [
        this.timeFormatService.fromTimeSpanFormat(shift.endTime),
        []
      ]
    });

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

  save() {
    if (!this.request)
      return;

    this.request.id = this.shift!.id;
    this.request.code = this.form.value.code;
    this.request.type = this.form.value.type;
    this.request.color = this.selectedColor;
    this.request.description = this.form.value.description;

    if (this.form.value.type === 'Workday') {
      this.request.startTime = this.timeFormatService.toTimeSpanFormat(this.form.value.startTime);
      this.request.endTime = this.timeFormatService.toTimeSpanFormat(this.form.value.endTime);
    }
    else{
      this.request.startTime = null;
      this.request.endTime = null;
    }

    this.shiftsService.updateShift(this.request!)
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
