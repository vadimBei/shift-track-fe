import { Component, inject, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditDepartmentRequest } from '../../../models/edit-department-request.model';
import { Department } from '../../../models/department.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-department-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-department-modal.component.html',
  styleUrl: './edit-department-modal.component.scss'
})
export class EditDepartmentModalComponent implements OnInit {
  departmentService = inject(DepartmentService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);

  request?: EditDepartmentRequest;
  department?: Department;

  ngOnInit(): void {
    this.request = {
      id: 0,
      name: ''
    }

    this.getDepartmentById();

    this.initializeForm(this.department!);
  }

  getDepartmentById() {
    this.departmentService.getDepartmentById(this.department!.id)
      .subscribe(department => {
        this.department = department;
      });
  }

  initializeForm(department: Department) {
    this.form = this.fb.group({
      name: [
        department.name,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  editDepartment() {
    if (!this.request)
      return;

    this.request.id = this.department!.id;
    this.request.name = this.form.value.name;

    this.departmentService.updateDepartment(this.request!)
      .subscribe({
        next: (departmen) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('updating department error', error);
        }
      })
  }
}
