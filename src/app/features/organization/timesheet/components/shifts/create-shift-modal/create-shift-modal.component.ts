import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateShiftRequest } from '../../../models/create-shift-request.model';
import { ShiftType } from '../../../enums/shift-type.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ShiftsService } from '../../../services/shifts.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-shift-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimepickerModule,
    FormsModule
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

    this.request.code = this.form.value.code;
    this.request.description = this.form.value.description;
    this.request.color = this.selectedColor;
    this.request.type = this.form.value.type;

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
