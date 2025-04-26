import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { AllEmployeesRequest } from '../../models/all-employees-request.model';
import { Subject, takeUntil, catchError, finalize, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Unit } from '../../../structure/models/unit.model';
import { UnitService } from '../../../structure/services/unit.service';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../structure/services/department.service';
import { Department } from '../../../structure/models/department.model';

@Component({
  selector: 'app-phones-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './phones-page.component.html',
  styleUrl: './phones-page.component.scss'
})
export class PhonesPageComponent implements OnInit, OnDestroy {
  private readonly employeeService = inject(EmployeesService);
  private readonly departmentService = inject(DepartmentService);
  private readonly unitService = inject(UnitService);
  private readonly fb = inject(FormBuilder);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();

  form!: FormGroup;
  request: AllEmployeesRequest = {
    searchPattern: '',
    unitId: undefined,
    departmentId: undefined
  };

  employees = signal<Employee[]>([]);
  units = signal<Unit[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.initializeForm();

    this.searchSubject$
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(searchPattern => {
        this.request.searchPattern = searchPattern;
        this.getEmployees();
      });

    this.getUnits();
    this.getEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      searchPattern: [''],
      unitId: [null],
      departmentId: [null]
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject$.next(inputElement.value);
  }

  onUnitChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const unitId = selectElement.value;

    if (unitId === 'null') {
      this.request.unitId = undefined;
      this.request.departmentId = undefined;
      this.departments.set([]);
      this.form.get('departmentId')?.setValue(null);
    } else {
      const numericUnitId = Number(unitId);
      this.request.unitId = numericUnitId;
      this.getDepartmentsByUnitId(numericUnitId);
    }

    this.getEmployees();
  }

  onDepartmentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const departmentId = selectElement.value;

    this.request.departmentId = departmentId === 'null'
      ? undefined
      : Number(departmentId);

    this.getEmployees();
  }

  getEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeService.getAllEmployees(this.request)
      .pipe(
        catchError(error => {
          this.errorMessage.set('Failed to load employees. Please try again.');
          console.error('Error fetching employees:', error);
          return of([] as Employee[]);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe(employees => {
        this.employees.set(employees);
      });
  }

  getUnits(): void {
    this.unitService.getUnits()
      .pipe(
        catchError(error => {
          console.error('Error fetching units:', error);
          return of([] as Unit[]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(units => {
        this.units.set(units);
      });
  }

  getDepartmentsByUnitId(unitId: number): void {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .pipe(
        catchError(error => {
          console.error('Error fetching departments:', error);
          return of([] as Department[]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(departments => {
        this.departments.set(departments);
      });
  }
}
