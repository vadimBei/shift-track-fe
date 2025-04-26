import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {EmployeeRoleUnitDepartmentsService} from "../../services/employee-role-unit-departments.service";
import {Subject, takeUntil} from "rxjs";
import {Department} from "../../../../features/organization/structure/models/department.model";
import {DepartmentService} from "../../../../features/organization/structure/services/department.service";
import {CreateEmployeeRoleUnitDepartmentRequest} from "../../models/create-employee-role-unit-department-request.model";
import {EmployeeRoleUnitsService} from "../../services/employee-role-units.service";
import {EmployeeRoleUnit} from "../../models/employee-role-unit.model";

@Component({
  selector: 'app-create-employee-role-unit-department-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-employee-role-unit-department-modal.component.html',
  styleUrl: './create-employee-role-unit-department-modal.component.scss'
})
export class CreateEmployeeRoleUnitDepartmentModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private departmentService = inject(DepartmentService);
  private employeeRoleUnitsService = inject(EmployeeRoleUnitsService);
  private employeeRoleUnitDepartmentService = inject(EmployeeRoleUnitDepartmentsService);

  bsModalRef = inject(BsModalRef);

  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});

  employeeRoleUnitId?: number;
  departments = signal<Department[]>([]);

  request = signal<CreateEmployeeRoleUnitDepartmentRequest>({
    employeeRoleUnitId: 0,
    departmentId: 0
  });

  ngOnInit(): void {
    this.getEmployeeRoleUnit(this.employeeRoleUnitId!);

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEmployeeRoleUnit(employeeRoleUnitId: number) {
    this.employeeRoleUnitsService.getById(employeeRoleUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(employeeRoleUnit => this.getDepartmentsByUnitId(employeeRoleUnit.unit!.id));
  }

  getDepartmentsByUnitId(unitId: number) {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(departments => this.departments.set(departments));
  }

  initializeForm() {
    this.form = this.fb.group({
      departmentId: this.fb.control<number | null>(null),
    });
  }

  createEmployeeRoleUnitDepartment() {
    if (!this.employeeRoleUnitId)
      return;

    this.request.update(current => ({
      ...current,
      employeeRoleUnitId: this.employeeRoleUnitId!,
      departmentId: Number(this.form.value.departmentId)
    }));

    this.employeeRoleUnitDepartmentService.create(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.bsModalRef.hide());
  }
}
