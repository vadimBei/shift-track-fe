import { Component, inject, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditUnitRequest } from '../../../models/edit-unit-request.model';
import { UnitService } from '../../../services/unit.service';

@Component({
  selector: 'app-edit-unit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-unit-modal.component.html',
  styleUrl: './edit-unit-modal.component.scss'
})
export class EditUnitModalComponent implements OnInit {
  fb = inject(FormBuilder);
  unitService = inject(UnitService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  request?: EditUnitRequest;
  unit?: Unit;

  constructor() {
  }

  ngOnInit(): void {
    this.request = {
      id: 0,
      name: '',
      description: '',
      code: ''
    }

    this.getUnitById();

    this.initializeForm(this.unit!);
  }

  getUnitById() {
    this.unitService.getUnitById(this.unit!.id)
      .subscribe(unit => {
        this.unit = unit;
      });
  }

  initializeForm(unit: Unit) {
    this.form = this.fb.group({
      code: [
        unit.code,
        [
          Validators.required,
          Validators.maxLength(10)
        ]
      ],
      name: [
        unit.name,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      description: [
        unit.description,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  updateUnit() {
    if (!this.request)
      return;

    this.request.id = this.unit!.id;
    this.request.code = this.form.value.code;
    this.request.name = this.form.value.name;
    this.request.description = this.form.value.description;

    this.unitService.updateUnit(this.request!)
      .subscribe({
        next: (unit) => {
          this.bsModalRef.hide();
        },
        error: err => {
          console.error('updating unit error', err);
        }
      });
  }
}
