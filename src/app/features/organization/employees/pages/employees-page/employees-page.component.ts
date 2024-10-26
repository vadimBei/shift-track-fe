import { Component, inject, OnInit } from '@angular/core';
import { GoBackComponent } from '../../../../../shared/components/go-back/go-back.component';
import { EmployeesService } from '../../services/employees.service';
import { UnitService } from '../../../structure/services/unit.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, subscribeOn } from 'rxjs';
import { AllEmployeesRequest } from '../../models/all-employees-request.model';
import { Employee } from '../../models/employee.model';
import { Unit } from '../../../structure/models/unit.model';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../structure/services/department.service';
import { Department } from '../../../structure/models/department.model';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoBackComponent
  ],
  templateUrl: './employees-page.component.html',
  styleUrl: './employees-page.component.scss'
})
export class EmployeesPageComponent implements OnInit {
  departmentService = inject(DepartmentService);
  employeeService = inject(EmployeesService);
  unitService = inject(UnitService);
  fb = inject(FormBuilder);
  searchSubject$: Subject<string> = new Subject<string>();
  form: FormGroup = new FormGroup({});

  request?: AllEmployeesRequest;
  employees$: Subject<Employee[]> = new Subject<Employee[]>();
  units$: Subject<Unit[]> = new Subject<Unit[]>();
  departments$: Subject<Department[]> = new Subject<Department[]>();
  unitId?: number;

  ngOnInit(): void {
    this.getEmployees();

    this.request = {
      searchPattern: '',
      unitId: undefined,
      departmentId: undefined
    }

    this.initializeForm();

    this.searchSubject$
      .pipe(
        debounceTime(500)
      )
      .subscribe(searchPattern => {
        this.request!.searchPattern = searchPattern;
        this.getEmployees();
      });

    this.loadUnits();
  }

  getEmployees() {
    this.employeeService.getAllEmployees(this.request!)
      .subscribe(val => {
        this.employees$.next(val);
      });
  }

  initializeForm() {
    this.form = this.fb.group({
      searchPattern: [undefined],
      unitId: [null],
      departmentId: [null]
    });
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject$.next(inputElement.value);
  }

  onUnitChange(event: Event) {
    if (!this.request)
      return;

    const selectElement = event.target as HTMLSelectElement;
    const unitId = selectElement.value;

    if (unitId == 'null') {
      this.request.unitId = undefined;

      this.departments$.next([]);

      this.initializeForm();
    }
    else {
      this.request.unitId = Number(unitId);

      this.loadDepartmentsByUnitId(this.request!.unitId!);
    }

    this.getEmployees();
  }

  onDepartmentChange(event: Event) {
    if (!this.request)
      return;

    const selectElement = event.target as HTMLSelectElement;
    const departmentId = selectElement.value;

    if (departmentId == 'null')
      this.request.departmentId = undefined;
    else
      this.request.departmentId = Number(departmentId);

    this.getEmployees();
  }

  loadUnits() {
    this.unitService.getUnits()
      .subscribe(units => {
        this.units$.next(units);
      });
  }

  loadDepartmentsByUnitId(unitId: number) {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .subscribe(departments => {
        this.departments$.next(departments);
      });
  }
}