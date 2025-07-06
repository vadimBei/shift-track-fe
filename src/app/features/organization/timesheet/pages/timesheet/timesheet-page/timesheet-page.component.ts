import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Employee} from "../../../../employees/models/employee.model";
import {CommonModule} from "@angular/common";
import {BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {Shift} from "../../../models/shift.model";
import {EmployeeTimesheet} from "../../../models/employee-timesheet.model";
import moment from "moment";
import 'moment/locale/uk';
import {EmployeeGender} from "../../../../employees/enums/employee-gender.enum";
import {ShiftType} from "../../../enums/shift-type.enum";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {Unit} from "../../../../structure/models/unit.model";
import {Department} from "../../../../structure/models/department.model";
import {catchError, of, Subject, takeUntil} from "rxjs";
import {DepartmentService} from "../../../../structure/services/department.service";
import {UnitService} from "../../../../structure/services/unit.service";
import {debounceTime} from "rxjs/operators";
import {
  EditEmployeeShiftModalComponent
} from "../../../components/timesheet/edit-employee-shift-modal/edit-employee-shift-modal.component";
import {DayInfo} from "../../../models/day-info.model";

@Component({
  selector: 'app-timesheet-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    TooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './timesheet-page.component.html',
  styleUrl: './timesheet-page.component.scss'
})
export class TimesheetPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly unitService = inject(UnitService);

  private readonly searchSubject$ = new Subject<string>();

  employees = signal<Employee[]>([{
    id: 2,
    name: 'Jane',
    surname: 'Wilson',
    patronymic: 'Marie',
    fullName: 'Jane Marie Wilson',
    email: 'jane.wilson@company.com',
    phoneNumber: '+380507654321',
    gender: EmployeeGender.female
  }]);
  selectedMonth = signal<Date>(new Date());
  searchTerm = signal<string>('');
  timesheet = signal<EmployeeTimesheet[]>([]);
  form: FormGroup = this.fb.group({
    unitId: [null],
    departmentId: [null],
    displayMode: ['shifts'],
    period: [this.formatCurrentDate()]
  });
  units = signal<Unit[]>([]);
  departments = signal<Department[]>([]);
  shifts = signal<Shift[]>([
    {
      id: 1,
      code: "-",
      description: "Звільнено",
      color: "#FFFFFF",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.none
    },
    {
      id: 2,
      code: "В",
      description: "Основна щорічна відпустка",
      color: "#FFF176",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.vacation
    },
    {
      id: 3,
      code: "ВД",
      description: "Відрядження",
      color: "#A08780",
      startTime: "10:00:00",
      endTime: "20:00:00",
      workHours: "10:00:00",
      type: ShiftType.workday
    },
    {
      id: 4,
      code: "ВП",
      description: "Відпустка у зв'язку з вагітністю і пологами",
      color: "#FFFFFF",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.vacation
    },
    {
      id: 5,
      code: "ВХ",
      description: "Вихідний день",
      color: "#E0E0E0",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.dayOff
    },
    {
      id: 6,
      code: "ДД",
      description: "Відпустка за дитиною до 6-ти років",
      color: "#FFFFFF",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.vacation
    },
    {
      id: 7,
      code: "І",
      description: "Інші причини неявок",
      color: "#FFFFFF",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.none
    },
    {
      id: 8,
      code: "НА",
      description: "Відпустка без збереження заробітної плати за згодою обох сторін",
      color: "#FFFFFF",
      startTime: null,
      endTime: null,
      workHours: null,
      type: ShiftType.vacation
    },
    {
      id: 9,
      code: "Р10",
      description: "10-ти годинний робочий день",
      color: "#DDE776",
      startTime: "10:00:00",
      endTime: "20:00:00",
      workHours: "10:00:00",
      type: ShiftType.workday
    },
    {
      id: 10,
      code: "Р9",
      description: "9-ти годинний робочий день",
      color: "#AED584",
      startTime: "10:00:00",
      endTime: "19:00:00",
      workHours: "09:00:00",
      type: ShiftType.workday
    }
  ]);

  constructor(private modalService: BsModalService) {
    moment.locale('uk');
  }

  ngOnInit() {
    this.initializeTimesheet();

    this.getUnits();

    this.searchSubject$
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(searchPattern => {
      });
  }

  private initializeTimesheet() {
    const employeeId = 2;
    const currentDate = moment(this.selectedMonth());
    const daysInMonth = currentDate.daysInMonth();

    const dayOffShift = this.shifts().find(s => s.code === 'ВХ');
    const defaultWorkdayShift = this.shifts().find(s => s.code === 'Р9');

    const shifts: (Shift | null)[] = Array(daysInMonth).fill(null).map((_, index) => {
      const day = index + 1;
      const date = moment(currentDate).date(day);
      const isWeekend = date.day() === 0 || date.day() === 6;

      return isWeekend ? dayOffShift! : defaultWorkdayShift!;
    });

    let totalWorkDays = 0;
    let totalWorkMinutes = 0;

    shifts.forEach(shift => {
      if (shift?.type === ShiftType.workday) {
        totalWorkDays++;
        if (shift.workHours) {
          const [hours, minutes] = shift.workHours.split(':').map(Number);
          totalWorkMinutes += hours * 60 + minutes;
        }
      }
    });

    const totalWorkHours = 10;

    const employeeTimesheet: EmployeeTimesheet = {
      employeeId,
      shifts,
      totalWorkDays,
      totalWorkHours
    };

    this.timesheet.set([employeeTimesheet]);
  }

  isWeekend(day: number): boolean {
    const date = moment(this.form.get('period')?.value).date(day);
    const dayOfWeek = date.day();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 - неділя, 6 - субота
  }

  // Додайте метод для отримання стилів клітинки
  getCellStyle(day: number, employeeId: number): { [key: string]: string } {
    const baseStyle: { [key: string]: string } = {};

    // Отримуємо зміну для цього дня
    const shift = this.getShiftForDay(employeeId, day);

    if (shift?.color) {
      // Якщо є зміна з кольором, використовуємо її колір
      baseStyle['background-color'] = shift.color;
    } else if (this.isWeekend(day)) {
      // Якщо немає зміни але це вихідний, використовуємо сірий
      baseStyle['background-color'] = '#EAEAEA';
    }

    return baseStyle;
  }


  getDays(): DayInfo[] {
    const date = moment(this.form.get('period')?.value);
    return Array.from(
      {length: date.daysInMonth()},
      (_, i) => {
        const currentDate = moment(date).date(i + 1);
        return {
          dayOfMonth: i + 1,
          dayOfWeek: currentDate.format('dd').toUpperCase() // 'dd' поверне скорочену назву дня тижня (Пн, Вт, etc.)
        };
      }
    );
  }


  private formatCurrentDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  getEmployeeTotalWorkDays(employeeId: number): number | undefined {
    return this.timesheet().find(t => t.employeeId === employeeId)?.totalWorkDays;
  }

  getEmployeeTotalWorkHours(employeeId: number): number | undefined {
    return this.timesheet().find(t => t.employeeId === employeeId)?.totalWorkHours;
  }

  getShiftForDay(employeeId: number, day: number): Shift | null {
    const timesheet = this.timesheet().find(t => t.employeeId === employeeId);
    return timesheet?.shifts[day - 1] || null;
  }

  openEditEmployeeShiftModal(employee: Employee, day: number) {
    const employeeShiftDate = moment(this.selectedMonth())
      .date(day)
      .toDate();

    const ref = this.modalService.show(
      EditEmployeeShiftModalComponent,
      {
        class: 'modal-dialog-centered',
        initialState: {
          employeeShiftDate: employeeShiftDate,
          employee: employee,
        }
      });

    ref.onHidden?.subscribe({})
  }

  exportToExcel() {
    // TODO: Implement Excel export
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject$.next(inputElement.value);
  }

  onUnitChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const unitId = selectElement.value;

    if (unitId === 'null') {
      // this.request.unitId = undefined;
      // this.request.departmentId = undefined;
      this.departments.set([]);
      this.form.get('departmentId')?.setValue(null);
    } else {
      const numericUnitId = Number(unitId);
      // this.request.unitId = numericUnitId;
      this.getDepartmentsByUnitId(numericUnitId);
    }

  }

  onDepartmentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const departmentId = selectElement.value;
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

  getCellContent(shift: Shift | null): string {
    const displayMode = this.form.get('displayMode')?.value;

    if (!shift) return '';

    if (displayMode === 'shifts') {
      return shift.code;
    } else {
      // Режим годин
      if (shift.startTime && shift.endTime) {
        return `${shift.startTime.slice(0, 5)}\n${shift.endTime.slice(0, 5)}`;
      } else {
        return shift.code;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
