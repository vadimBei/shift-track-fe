import { Component, inject, OnInit } from '@angular/core';
import { EmployeesService } from '../../services/employees.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditEmployeeRequest } from '../../models/edit-employee-request';
import { EmployeeGender } from '../../enums/employee-gender.enum';
import { Employee } from '../../models/employee.model';
import moment from 'moment';
import { Subject, throwError } from 'rxjs';
import { Unit } from '../../../structure/models/unit.model';
import { Department } from '../../../structure/models/department.model';
import { UnitService } from '../../../structure/services/unit.service';
import { DepartmentService } from '../../../structure/services/department.service';
import { CommonModule } from '@angular/common';
import { Position } from '../../../structure/models/position.model';
import { PositionService } from '../../../structure/services/position.service';

@Component({
  selector: 'app-edit-employee-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-employee-modal.component.html',
  styleUrl: './edit-employee-modal.component.scss'
})
export class EditEmployeeModalComponent implements OnInit {
  employeesService = inject(EmployeesService);
  unitService = inject(UnitService);
  departmentService = inject(DepartmentService);
  positionService = inject(PositionService);
  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});

  employeeId?: number;
  employee?: Employee;
  units$: Subject<Unit[]> = new Subject<Unit[]>();
  departments$: Subject<Department[]> = new Subject<Department[]>();
  positions$: Subject<Position[]> = new Subject<Position[]>();

  defaultDropdownDepartment: Department = {
    id: 0,
    name: 'Оберіть департамент',
    unit: undefined,
    unitId: undefined
  };

  defaultDropdownUnit: Unit = {
    id: 0,
    name: 'Оберіть регіон',
    code: '',
    description: '',
    fullName: ''
  };

  defaultDropdownPosition: Position = {
    id: 0,
    name: 'Оберіть посаду',
    description: ''
  };

  request: EditEmployeeRequest = {
    id: 0,
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    gender: EmployeeGender.none,
    phoneNumber: '',
    departmentId: undefined,
    positionId: undefined,
    dateOfBirth: undefined
  };

  ngOnInit(): void {
    this.initializeEmptyForm();

    this.getEmployeeById();
  }

  getEmployeeById() {
    if (this.employeeId) {
      this.employeesService.getEmployeeById(this.employeeId)
        .subscribe(employee => {
          if (employee) {
            this.getUnits();

            this.getPositions();

            if (employee.department) {
              this.getDepartmentsByUnitId(employee.department?.unitId!);
            }
            else {
              this.departments$.next([this.defaultDropdownDepartment]);
            }

            this.initializeForm(employee);
          }
        })
    }
  }

  initializeEmptyForm() {
    this.form = this.fb.group({
      surname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      patronymic: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      unitId: [0],
      positionId: [0],
      departmentId: [0],
      dateOfBirth: [null],
      gender: [null, [Validators.required]]
    });
  }

  initializeForm(employee: Employee) {
    this.form.patchValue({
      surname: employee.surname,
      name: employee.name,
      patronymic: employee.patronymic,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      unitId: employee.department?.unitId! ?? 0,
      positionId: employee.positionId! ?? 0,
      departmentId: employee.departmentId! ?? 0,
      dateOfBirth: this.formatDate(employee.dateOfBirth),
      gender: employee.gender
    })
  }

  formatDate(date?: Date) {
    if (!date)
      return null;

    return moment(date).format('YYYY-MM-DD');
  }

  save() {
    if (!this.employeeId)
      return;

    this.request.id = this.employeeId;
    this.request.name = this.form.value.name;
    this.request.patronymic = this.form.value.patronymic;
    this.request.surname = this.form.value.surname;
    this.request.email = this.form.value.email;
    this.request.dateOfBirth = this.form.value.dateOfBirth;
    this.request.gender = this.form.value.gender;
    this.request.phoneNumber = this.form.value.phoneNumber;
    this.request.departmentId = Number(this.form.value.departmentId) === 0 ? null : this.form.value.departmentId;
    this.request.positionId = Number(this.form.value.positionId) === 0 ? null : this.form.value.positionId;

    this.employeesService.updateEmployee(this.request)
      .subscribe({
        next: (employee) => {
          this.bsModalRef.hide();
        },
        error: error => throwError(() => new Error(error))
      });
  }

  getUnits() {
    this.unitService.getUnits()
      .subscribe(units => {
        this.units$.next([this.defaultDropdownUnit!, ...units]);
        this.departments$.next([this.defaultDropdownDepartment]);
      });
  }

  onUnitChange(event: Event) {
    if (!this.request)
      return;

    const selectElement = event.target as HTMLSelectElement;
    const unitId = selectElement.value;

    if (Number(unitId) == 0) {
      this.request.departmentId = undefined;

      this.departments$.next([this.defaultDropdownDepartment]);

      this.form.get('departmentId')?.setValue(this.defaultDropdownDepartment.id);
    }
    else {
      this.getDepartmentsByUnitId(Number(unitId));
    }
  }

  getDepartmentsByUnitId(unitId: number) {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .subscribe(departments => {
        this.departments$.next([this.defaultDropdownDepartment, ...departments]);
      });
  }

  getPositions() {
    this.positionService.geyPositions()
      .subscribe(positions => {
        if (positions)
          this.positions$.next([this.defaultDropdownPosition, ...positions]);
        else
          this.positions$.next([this.defaultDropdownPosition]);
      })
  }
}
