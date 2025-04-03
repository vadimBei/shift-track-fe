import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateShiftRequest } from '../../../models/create-shift-request.model';
import { ShiftType } from '../../../enums/shift-type.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ShiftsService } from '../../../services/shifts.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from '../../../../../../shared/components/color-picker/color-picker.component';

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
export class CreateShiftModalComponent {
  bsModalRef = inject(BsModalRef);
  shiftsService = inject(ShiftsService);
  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});

  request?: CreateShiftRequest;

  selectedColor: string = '#FFFFFF';

  ngOnInit(): void {
    this.request = {
      description: '',
      code: '',
      color: '',
      type: ShiftType.none
    }

    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
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
        '#FFFFFF',
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

    this.request.code = this.form.value.code;
    this.request.description = this.form.value.description;
    this.request.color = this.selectedColor;
    this.request.type = this.form.value.type;
    this.request.startTime = this.form.value.startTime;
    this.request.endTime = this.form.value.endTime;

    this.shiftsService.createShift(this.request)
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
