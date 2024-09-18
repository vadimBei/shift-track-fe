import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateUnitRequest } from '../../../models/create-unit-request.model';

@Component({
  selector: 'app-create-unit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-unit-modal.component.html',
  styleUrl: './create-unit-modal.component.scss'
})
export class CreateUnitModalComponent implements OnInit {
  fb = inject(FormBuilder);
  unitService = inject(UnitService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  request?: CreateUnitRequest;
  title = '';

  ngOnInit(): void {
    this.request = {
      name: '',
      description: '',
      code: ''
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
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  createUnit() {
    if (!this.request)
      return;

    this.request.code = this.form.value.code;
    this.request.name = this.form.value.name;
    this.request.description = this.form.value.description;

    this.unitService.createUnit(this.request!)
      .subscribe({
        next: (unit) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('creating unit error', error);
        }
      }
      )
  }
}
