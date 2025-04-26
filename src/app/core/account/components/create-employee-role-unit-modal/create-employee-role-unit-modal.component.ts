import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {Subject, takeUntil} from "rxjs";
import {UnitService} from "../../../../features/organization/structure/services/unit.service";
import {EmployeeRoleUnitsService} from "../../services/employee-role-units.service";
import {Unit} from "../../../../features/organization/structure/models/unit.model";
import {CreateEmployeeRoleUnitRequest} from "../../models/create-employee-role-unit-request.model";

@Component({
  selector: 'app-create-employee-role-unit-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-employee-role-unit-modal.component.html',
  styleUrl: './create-employee-role-unit-modal.component.scss'
})
export class CreateEmployeeRoleUnitModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private employeeRoleUnitService = inject(EmployeeRoleUnitsService);
  private unitService = inject(UnitService);

  bsModalRef = inject(BsModalRef);

  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});

  employeeRoleId?: number;
  units = signal<Unit[]>([]);

  request = signal<CreateEmployeeRoleUnitRequest>({
    employeeRoleId: 0,
    unitId: 0
  });

  ngOnInit(): void {
    this.getUnits();

    this.initializeForm();
  }

  getUnits() {
    this.unitService.getUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe(units => this.units.set(units));
  }

  initializeForm() {
    this.form = this.fb.group({
      unitId: this.fb.control<number | null>(null),
    });
  }

  createEmployeeRoleUnit() {
    if (!this.employeeRoleId)
      return;

    this.request.update(current => ({
      ...current,
      employeeRoleId: this.employeeRoleId!,
      unitId: Number(this.form.value.unitId)
    }));

    this.employeeRoleUnitService.create(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.bsModalRef.hide());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
