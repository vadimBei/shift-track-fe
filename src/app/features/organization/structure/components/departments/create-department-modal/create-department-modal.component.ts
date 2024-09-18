import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateDepartmentRequest } from '../../../models/create-demartment-request.model';
import { UnitService } from '../../../services/unit.service';
import { Subject } from 'rxjs';
import { Unit } from '../../../models/unit.model';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-create-department-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-department-modal.component.html',
  styleUrl: './create-department-modal.component.scss'
})
export class CreateDepartmentModalComponent implements OnInit {
  unitService = inject(UnitService);
  departmentService = inject(DepartmentService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);

  units$: Subject<Unit[]> = new Subject<Unit[]>();
  request?: CreateDepartmentRequest;

  ngOnInit(): void {
    this.request = {
      name: '',
      unitId: 0
    }

    this.initializeForm();
    this.getUnits();
  }

  initializeForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      unitId: [
        null,
        [
          Validators.required
        ]
      ]
    });
  }

  getUnits() {
    this.unitService.getUnits()
      .subscribe(units => {
        this.units$.next(units);
      });
  }

  createDepartment() {
    if (!this.request)
      return;

    this.request.name = this.form.value.name;
    this.request.unitId = Number(this.form.value.unitId);

    this.departmentService.createDepartment(this.request!)
      .subscribe({
        next: (department) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('creating department error', error);
        }
      })
  }
}
