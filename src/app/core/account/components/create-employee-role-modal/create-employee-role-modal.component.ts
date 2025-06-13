import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {catchError, of, Subject, takeUntil} from 'rxjs';
import {Role} from '../../models/role.model';
import {RolesService} from '../../services/roles.service';
import {CommonModule} from '@angular/common';
import {Department} from '../../../../features/organization/structure/models/department.model';
import {Unit} from '../../../../features/organization/structure/models/unit.model';
import {UnitService} from '../../../../features/organization/structure/services/unit.service';
import {DepartmentService} from '../../../../features/organization/structure/services/department.service';
import {CreateEmployeeRoleRequest} from '../../models/create-employee-role-request.model';
import {EmployeeRolesService} from '../../services/employee-roles.service';
import {ErrorService} from "../../../../shared/services/error.service";
import {EmployeeRole} from "../../models/employee-role.model";

@Component({
  selector: 'app-create-employee-role-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-employee-role-modal.component.html',
  styleUrl: './create-employee-role-modal.component.scss'
})
export class CreateEmployeeRoleModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private unitService = inject(UnitService);
  private rolesService = inject(RolesService);
  private departmentService = inject(DepartmentService);
  private employeeRolesService = inject(EmployeeRolesService);

  bsModalRef = inject(BsModalRef);

  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    roleId: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ),
    unitId: this.fb.control<number | null>(null),
    departmentIds: this.fb.control<number[]>([])
  });

  roles = signal<Role[]>([]);
  units = signal<Unit[]>([]);
  departments = signal<Department[]>([]);

  employeeId?: number;
  request = signal<CreateEmployeeRoleRequest>({
    employeeId: 0,
    roleId: 0,
    unitId: undefined,
    departmentIds: []
  });

  ngOnInit(): void {
    this.getRoles();
    this.getUnits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRoles() {
    this.rolesService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: roles => this.roles.set(roles),
        error: error => {
          console.error('Failed to fetch roles', error);
        }
      });
  }

  getUnits() {
    this.unitService.getUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe(units => this.units.set(units));
  }

  onUnitChange(event: Event) {
    if (!this.request)
      return;

    const selectElement = event.target as HTMLSelectElement;
    const unitId = selectElement.value;

    if (unitId == 'null') {
      this.request.update(current => ({
        ...current,
        unitId: this.form.value.unitId,
        departmentIds: this.form.value.departmentIds || []
      }));

      this.form.patchValue({
        unitId: null,
        departmentIds: []
      });
    } else {
      this.request.update(current => ({
        ...current,
        unitId: Number(unitId),
      }));

      this.getDepartmentsByUnitId(this.request().unitId!);
    }

    this.departments.set([]);
    this.form.patchValue({
      departmentIds: []
    });

  }

  getDepartmentsByUnitId(unitId: number) {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(departments => this.departments.set(departments));
  }

  toggleSelection(departmentId: number): void {
    if (!this.form || !this.form.controls['departmentIds']) {
      return;
    }

    const departmentIds: number[] = this.form.controls['departmentIds'].value ?? [];

    if (departmentIds.includes(departmentId)) {
      this.form.controls['departmentIds'].setValue(
        departmentIds.filter(id => id !== departmentId)
      );
    } else {
      this.form.controls['departmentIds'].setValue([...departmentIds, departmentId]);
    }

    this.form.controls['departmentIds'].updateValueAndValidity();
  }

  isSelected(departmentId: number): boolean {
    if (!this.form || !this.form.controls['departmentIds']) {
      return false;
    }

    const departmentIds: number[] = this.form.controls['departmentIds'].value ?? [];

    return departmentIds.includes(departmentId);
  }

  createEmployeeRole() {
    if (!this.employeeId)
      return;

    this.request.update(current => ({
      ...current,
      employeeId: this.employeeId!,
      unitId: this.form.value.unitId,
      roleId: Number(this.form.value.roleId),
      departmentIds: this.form.value.departmentIds || []
    }));

    this.employeeRolesService.create(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.bsModalRef.hide());
  }
}
