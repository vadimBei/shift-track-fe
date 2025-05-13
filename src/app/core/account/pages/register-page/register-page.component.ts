import {Component, inject, OnDestroy, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';
import {AbstractControl} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AccountService} from '../../services/account.service';
import {CreateUserRequest} from '../../models/create-user-request.model';
import {EmployeeGender} from '../../../../features/organization/employees/enums/employee-gender.enum';

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
export class RegisterPageComponent implements OnDestroy {
  private accountService = inject(AccountService);
  private destroy$ = new Subject<void>();

  router = inject(Router);

  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
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

  isPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);
  validationErrors?: string[];

  request = signal<CreateUserRequest>({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phoneNumber: '',
    gender: EmployeeGender.none,
    password: '',
    confirmPassword: ''
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  register() {
    if (this.form.valid) {
      // Create a new request object with updated values
      const updatedRequest: CreateUserRequest = {
        name: this.form.value.name,
        surname: this.form.value.surname,
        patronymic: this.form.value.patronymic,
        email: this.form.value.email,
        phoneNumber: this.form.value.phoneNumber,
        gender: this.form.value.gender,
        confirmPassword: this.form.value.confirmPassword,
        password: this.form.value.password
      };

      // Update the signal with the new request
      this.request.set(updatedRequest);

      this.accountService.register(this.request())
        .pipe(takeUntil(this.destroy$))
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

    return password === confirmPassword ? null : {passwordsNotMatch: true};
  }
}
