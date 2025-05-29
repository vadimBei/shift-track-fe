import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../../services/account.service";
import {Employee} from "../../../../features/organization/employees/models/employee.model";
import {ChangePasswordRequest} from "../../models/change-password-request.model";
import {ErrorService} from "../../../../shared/services/error.service";
import {ErrorType} from "../../../../shared/enums/error-type.enum";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private errorService = inject(ErrorService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);

  employee = signal<Employee | null>(null);
  form: FormGroup = this.fb.group({
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
        ]
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
        ]
      ],
    },
    {
      validators: this.passwordMatchValidator
    });

  request = signal<ChangePasswordRequest>({
    employeeId: 0,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  isOldPasswordVisible = signal<boolean>(false);
  isNewPasswordVisible = signal<boolean>(false);
  isConfirmPasswordVisible = signal<boolean>(false);

  ngOnInit() {
    this.loadCurrentEmployee();
  }

  loadCurrentEmployee(): void {
    this.accountService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (currentUser) => {
          if (currentUser && currentUser.employee) {
            this.employee.set(currentUser.employee);
          }
        }
      });
  }

  savePassword() {
    if (this.employee() == null)
      return;

    this.request.update(value => ({
      ...value,
      employeeId: this.employee()?.id || 0,
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
      confirmPassword: this.form.value.confirmPassword
    }));

    this.accountService.changePassword(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.errorService.handleError('Пароль успішно збережено', ErrorType.info)
      });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : {passwordsNotMatch: true};
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
