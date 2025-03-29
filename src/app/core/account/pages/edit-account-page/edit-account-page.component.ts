import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { EmployeesService } from '../../../../features/organization/employees/services/employees.service';
import { Employee } from '../../../../features/organization/employees/models/employee.model';
import { EmployeeGender } from '../../../../features/organization/employees/enums/employee-gender.enum';
import { EditAccountRequest } from '../../models/edit-account-request.model';
import moment from 'moment';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-edit-account-page',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-account-page.component.html',
  styleUrl: './edit-account-page.component.scss'
})
export class EditAccountPageComponent {
  accountService = inject(AccountService);
  employeeService = inject(EmployeesService);
  fb = inject(FormBuilder);

  form: FormGroup = new FormGroup({});

  request?: EditAccountRequest;
  employee?: Employee;

  constructor() {
    this.request = {
      id: 0,
      name: '',
      surname: '',
      patronymic: '',
      email: '',
      gender: EmployeeGender.none,
      phoneNumber: '',
      dateOfBirth: undefined
    };
  }

  ngOnInit(): void {
    this.getCurrentEmployee();

    this.initializeForm(this.employee!);
  }

  getCurrentEmployee() {
    this.accountService.getCurrentUser()
      .subscribe(currentUser => {
        this.employee = currentUser.employee;

        if (currentUser)
          this.initializeForm(currentUser.employee);
      })
  }

  initializeForm(employee: Employee) {
    this.form = this.fb.group({
      name: [
        employee?.name,
        [
          Validators.required
        ]
      ],
      patronymic: [
        employee?.patronymic,
        [
          Validators.required
        ]
      ],
      surname: [
        employee?.surname,
        [
          Validators.required
        ]
      ],
      email: [
        employee?.email,
        [
          Validators.required,
          Validators.email
        ]
      ],
      phoneNumber: [
        employee?.phoneNumber,
        [
          Validators.required
        ]
      ],
      dateOfBirth: [
        this.formatDate(employee.dateOfBirth)
      ],
      gender: [
        employee?.gender,
        [
          Validators.required
        ]
      ]
    })
  }

  save() {
    if (!this.request)
      return;

    this.request.id = this.employee!.id;
    this.request.name = this.form.value.name;
    this.request.patronymic = this.form.value.patronymic;
    this.request.surname = this.form.value.surname;
    this.request.email = this.form.value.email;
    this.request.dateOfBirth = this.form.value.dateOfBirth;
    this.request.gender = this.form.value.gender;
    this.request.phoneNumber = this.form.value.phoneNumber;

    this.accountService.updateAccount(this.request)
      .subscribe({
        error: error => throwError(() => new Error(error))
      });
  }

  formatDate(date?: Date) {
    if (!date)
      return null;

    return moment(date).format('YYYY-MM-DD');
  }
}
