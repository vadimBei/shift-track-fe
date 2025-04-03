import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ShiftsService } from '../../../services/shifts.service';
import { Shift } from '../../../models/shift.model';
import { EditShiftRequest } from '../../../models/edit-shift-request.model';
import { ShiftType } from '../../../enums/shift-type.enum';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-shift-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimepickerModule,
    FormsModule
  ],
  templateUrl: './edit-shift-modal.component.html',
  styleUrl: './edit-shift-modal.component.scss'
})
export class EditShiftModalComponent {
  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});
  bsModalRef = inject(BsModalRef);

  shiftsService = inject(ShiftsService);
  shift?: Shift;

  request?: EditShiftRequest;
  colors: string[] = [
    '#E57373', '#F06292', '#B66AC5', '#9675CE', '#7986CC',
    '#64B5F6', '#4FC2F8', '#4DD0E2', '#4CB6AC', '#80C783',
    '#AED584', '#DDE776', '#FFF176', '#FFD54D', '#FFB64D',
    '#FF8B66', '#A08780', '#E0E0E0', '#90A4AD', '#FFFFFF'
  ];

  selectedColor: string = '#FFFFFF';
  dropdownOpen: boolean = false;

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
        '',
        []
      ],
      endTime: [
        '',
        []
      ]
    });

    // this.form.get('type')?.valueChanges.subscribe(value => {
    //   if (value === 'Workday') {
    //     this.form.get('startTime')?.setValidators([Validators.required]);
    //     this.form.get('endTime')?.setValidators([Validators.required]);
    //   } else {
    //     this.form.get('startTime')?.clearValidators();
    //     this.form.get('endTime')?.clearValidators();
    //   }

    //   this.form.get('startTime')?.updateValueAndValidity();
    //   this.form.get('endTime')?.updateValueAndValidity();
    // });
  }

  save() {
    if (!this.request)
      return;

    this.request.id = this.shift!.id;
    this.request.code = this.form.value.code;
    this.request.type = this.form.value.type;
    this.request.color = this.selectedColor;
    this.request.description = this.form.value.description;

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

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.dropdownOpen = false;
  }

  updateColor(): void {
    if (!/^#[0-9A-Fa-f]{6}$/.test(this.selectedColor)) {
      this.selectedColor = '#ffffff';
    }
  }
}
