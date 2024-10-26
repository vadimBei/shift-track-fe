import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { EmployeeGender } from '../../../../features/organization/employees/enums/employee-gender.enum';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  fb = inject(FormBuilder);
  form: FormGroup = new FormGroup({});
  isPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);
  validationErrors?: string[];
  request?: CreateUserRequest;


  ngOnInit(): void {
    this.initializeForm()

    this.request = {
      name: '',
      surname: '',
      patronymic: '',
      email: '',
      phoneNumber: '',
      gender: EmployeeGender.none,
      password: '',
      confirmPassword: ''
    };
  }

  initializeForm() {
    this.form = this.fb.group({
      name: ['', [
        Validators.required
      ]],
      surname: ['', [
        Validators.required
      ]],
      patronymic: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
      ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
      ]
      ],
      gender: [null, [Validators.required]],
    },
      {
        validators: this.passwordMatchValidator
      });
  }

  register() {
    if (this.form.valid) {
      if (!this.request)
        return;

      this.request.name = this.form.value.name;
      this.request.surname = this.form.value.surname;
      this.request.patronymic = this.form.value.patronymic;
      this.request.email = this.form.value.email;
      this.request.phoneNumber = this.form.value.phoneNumber;
      this.request.gender = this.form.value.gender;
      this.request.confirmPassword = this.form.value.confirmPassword;
      this.request.password = this.form.value.password;

      this.accountService.register(this.request)
        .subscribe({
          next: () => this.router.navigateByUrl('/employees/contact-list'),
          error: err => {
            this.validationErrors = err;
          }
        });
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsNotMatch: true };
  }
}