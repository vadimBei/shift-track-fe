import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { AllEmployeesRequest } from '../../models/all-employees-request.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Unit } from '../../../structure/models/unit.model';
import { UnitService } from '../../../structure/services/unit.service';
import { CommonModule } from '@angular/common';

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
export class PhonesPageComponent implements OnInit {
  private employeeService = inject(EmployeesService);
  private unitService = inject(UnitService);

  private fb = inject(FormBuilder);
  private searchSubject$: Subject<string> = new Subject<string>();
  public form: FormGroup = new FormGroup({});
  
  request?: AllEmployeesRequest;
  employees$: Subject<Employee[]> = new Subject<Employee[]>();
  units$: Subject<Unit[]> = new Subject<Unit[]>();
  unitId?: number;

  constructor() {

  }

  ngOnInit(): void {
    this.getEmployees();

    this.request = {
      searchPattern: '',
      unitId: undefined
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

  initializeForm() {
    this.form = this.fb.group({
      searchPattern: [undefined],
      unitId: [null]
    });
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject$.next(inputElement.value);
  }

  onUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (!this.request)
      return;

    if (value == 'null')
      this.request.unitId = undefined;
    else
      this.request.unitId = Number(selectElement.value);

    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getAllEmployees(this.request!)
      .subscribe(val => {
        this.employees$.next(val);
      });
  }

  loadUnits() {
    this.unitService.getUnits()
      .subscribe(units => {
        this.units$.next(units);
      });
  }
}
