import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DepartmentService} from "../../../../organization/structure/services/department.service";
import {UnitService} from "../../../../organization/structure/services/unit.service";
import {catchError, of, Subject, takeUntil} from "rxjs";
import {Unit} from "../../../../organization/structure/models/unit.model";
import {Department} from "../../../../organization/structure/models/department.model";
import {debounceTime} from "rxjs/operators";
import {AllVacationsRequest} from "../../models/all-vacations-request.model";
import {Vacation} from "../../models/vacation.model";
import {VacationType} from "../../enums/vacation-type.enum";
import {VacationStatus} from "../../enums/vacation-status.enum";
import {EmployeeGender} from "../../../../organization/employees/enums/employee-gender.enum";
import {CommonModule} from "@angular/common";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {BsModalService} from "ngx-bootstrap/modal";
import {EditVacationModalComponent} from "../../components/edit-vacation-modal/edit-vacation-modal.component";
import {CreateVacationModalComponent} from "../../components/create-vacation-modal/create-vacation-modal.component";

@Component({
  selector: 'app-vacations-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TooltipModule
  ],
  templateUrl: './vacations-page.component.html',
  styleUrl: './vacations-page.component.scss'
})
export class VacationsPageComponent implements OnInit, OnDestroy {
  private readonly departmentService = inject(DepartmentService);
  private readonly unitService = inject(UnitService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(BsModalService);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();

  form: FormGroup = this.fb.group({
    searchPattern: [''],
    unitId: [null],
    departmentId: [null],
    dateFrom: [null],
    dateTo: [null],
    vacationStatus: [null]
  });

  request: AllVacationsRequest = {
    searchPattern: '',
    unitId: undefined,
    departmentId: undefined,
    vacationStatus: VacationStatus.none
  };

  units = signal<Unit[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal(false);
  vacations = signal<Vacation[]>([
    {
      id: 1,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-14'),
      daysCount: 14,
      type: VacationType.yearMainVacation,
      status: VacationStatus.approved,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 1,
        name: 'John',
        surname: 'Doe',
        patronymic: 'Smith',
        fullName: 'John Smith Doe',
        email: 'john.doe@company.com',
        phoneNumber: '+380501234567',
        gender: EmployeeGender.male
      }
    },
    {
      id: 2,
      dateFrom: new Date('2024-02-01'),
      dateTo: new Date('2024-02-07'),
      daysCount: 7,
      type: VacationType.bonusVacation,
      status: VacationStatus.approved,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 2,
        name: 'Jane',
        surname: 'Wilson',
        patronymic: 'Marie',
        fullName: 'Jane Marie Wilson',
        email: 'jane.wilson@company.com',
        phoneNumber: '+380507654321',
        gender: EmployeeGender.female
      }
    },
    {
      id: 3,
      dateFrom: new Date('2024-03-15'),
      dateTo: new Date('2024-03-28'),
      daysCount: 14,
      type: VacationType.yearMainVacation,
      status: VacationStatus.rejected,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 3,
        name: 'Mike',
        surname: 'Brown',
        patronymic: 'James',
        fullName: 'Mike James Brown',
        email: 'mike.brown@company.com',
        phoneNumber: '+380509876543',
        gender: EmployeeGender.male
      }
    },
    {
      id: 4,
      dateFrom: new Date('2024-04-01'),
      dateTo: new Date('2024-04-07'),
      daysCount: 7,
      type: VacationType.vacationWithoutSalaryByFamily,
      status: VacationStatus.approved,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 4,
        name: 'Sarah',
        surname: 'Davis',
        patronymic: 'Elizabeth',
        fullName: 'Sarah Elizabeth Davis',
        email: 'sarah.davis@company.com',
        phoneNumber: '+380503456789',
        gender: EmployeeGender.female
      }
    },
    {
      id: 5,
      dateFrom: new Date('2024-05-15'),
      dateTo: new Date('2024-05-21'),
      daysCount: 7,
      type: VacationType.yearMainVacation,
      status: VacationStatus.none,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 5,
        name: 'Robert',
        surname: 'Miller',
        patronymic: 'William',
        fullName: 'Robert William Miller',
        email: 'robert.miller@company.com',
        phoneNumber: '+380505555555',
        gender: EmployeeGender.male
      }
    },
    {
      id: 6,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-14'),
      daysCount: 14,
      type: VacationType.yearMainVacation,
      status: VacationStatus.approved,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 1,
        name: 'John',
        surname: 'Doe',
        patronymic: 'Smith',
        fullName: 'John Smith Doe',
        email: 'john.doe@company.com',
        phoneNumber: '+380501234567',
        gender: EmployeeGender.male
      }
    },
    {
      id: 7,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-14'),
      daysCount: 14,
      type: VacationType.yearMainVacation,
      status: VacationStatus.approved,
      dateOfCreation: new Date('2024-01-14'),
      employee: {
        id: 1,
        name: 'John',
        surname: 'Doe',
        patronymic: 'Smith',
        fullName: 'John Smith Doe',
        email: 'john.doe@company.com',
        phoneNumber: '+380501234567',
        gender: EmployeeGender.male
      }
    }
  ]);

  ngOnInit(): void {
    this.searchSubject$
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(searchPattern => {
        this.request.searchPattern = searchPattern;
      });

    this.getUnits();
  }

  getUnits(): void {
    this.unitService.getUnits()
      .pipe(
        catchError(error => {
          return of([] as Unit[]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(units => {
        this.units.set(units);
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

  }

  onDepartmentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const departmentId = selectElement.value;

    this.request.departmentId = departmentId === 'null'
      ? undefined
      : Number(departmentId);
  }

  onVacationStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;
  }

  getDepartmentsByUnitId(unitId: number): void {
    this.departmentService.getDepartmentsByUnitId(unitId)
      .pipe(
        catchError(error => {
          return of([] as Department[]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(departments => {
        this.departments.set(departments);
      });
  }

  getVacationTypeString(type: VacationType): string {
    switch (type) {
      case VacationType.yearMainVacation:
        return 'Основна щорічна відпустка';
      case VacationType.bonusVacation:
        return 'Бонусна відпустка';
      default:
        return 'Відпустка';
    }
  }

  getStatusClass(status: VacationStatus): string {
    switch (status) {
      case VacationStatus.approved:
        return 'status-approved';
      case VacationStatus.rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }


  getVacationStatusString(status: VacationStatus): string {
    switch (status) {
      case VacationStatus.approved:
        return 'Погоджено';
        case VacationStatus.rejected:
          return 'Відхилено';
      default:
        return '';
    }
  }

  openEditDepartmentModal(vacation: Vacation): void {
    const ref = this.modalService.show(
      EditVacationModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          vacation: vacation,
        }
      });

    ref.onHidden?.subscribe({
      next: () => this.getVacations()
    })
  }

  getVacations(){

  }

  openCreateVacationModal() {
    const ref = this.modalService.show(
      CreateVacationModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
        }
      }
    );

    ref.onHidden?.subscribe({
      next: () => this.getVacations()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
