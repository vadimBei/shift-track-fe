import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Employee } from '../../../../features/organization/employees/models/employee.model';
import { EmployeeGender } from '../../../../features/organization/employees/enums/employee-gender.enum';
import { EditAccountRequest } from '../../models/edit-account-request.model';
import { Subject, catchError, finalize, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import moment from "moment";

@Component({
  selector: 'app-edit-account-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-account-page.component.html',
  styleUrl: './edit-account-page.component.scss'
})
export class EditAccountPageComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    patronymic: ['', [Validators.required, Validators.maxLength(100)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]],
    dateOfBirth: [null],
    gender: [EmployeeGender.none, [Validators.required]]
  });

  isLoading = signal<boolean>(false);
  saveSuccess = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  employee = signal<Employee | null>(null);

  formattedDateOfBirth = computed(() => {
    const dateOfBirth = this.employee()?.dateOfBirth;
    return dateOfBirth ? this.formatDate(dateOfBirth) : null;
  });

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCurrentEmployee(): void {
    this.isLoading.set(true);
    this.accountService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (currentUser) => {
          if (currentUser && currentUser.employee) {
            this.employee.set(currentUser.employee);
            this.updateFormWithEmployeeData();
          }
        },
        error: (error) => {
          this.errorMessage.set('Помилка завантаження даних користувача');
          console.error('Error loading user data:', error);
        }
      });
  }

  updateFormWithEmployeeData(): void {
    const emp = this.employee();
    if (!emp) return;

    this.form.patchValue({
      name: emp.name,
      patronymic: emp.patronymic,
      surname: emp.surname,
      email: emp.email,
      phoneNumber: emp.phoneNumber,
      dateOfBirth: this.formattedDateOfBirth(),
      gender: emp.gender
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Будь ласка, заповніть всі обов\'язкові поля коректно');
      return;
    }

    this.errorMessage.set(null);
    this.saveSuccess.set(false);
    this.isLoading.set(true);

    const updatedRequest: EditAccountRequest = {
      id: this.employee()?.id || 0,
      name: this.form.value.name,
      patronymic: this.form.value.patronymic,
      surname: this.form.value.surname,
      email: this.form.value.email,
      dateOfBirth: this.form.value.dateOfBirth,
      gender: this.form.value.gender,
      phoneNumber: this.form.value.phoneNumber
    };

    this.accountService.updateAccount(updatedRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
        catchError(error => {
          this.errorMessage.set('Помилка при збереженні даних: ' + (error.message || 'Невідома помилка'));
          console.error('Error updating account:', error);
          throw error;
        })
      )
      .subscribe({
        next: () => {
          this.saveSuccess.set(true);

          this.loadCurrentEmployee();
        }
      });
  }

  formatDate(date?: Date): string | null {
    if (!date)
      return null;

    return moment(date).format('YYYY-MM-DD');
  }
}
