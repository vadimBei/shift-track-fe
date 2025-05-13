import {Component, inject, OnDestroy, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})

export class LoginPageComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    login:
      [
        '',
        [
          Validators.required
        ]],
    password:
      [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
        ]
      ]
  });

  isPasswordVisible = signal<boolean>(false);
  validationErrors?: string[];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    if (this.form.valid) {
      this.accountService.login(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigateByUrl('/employees/contact-list'),
          error: err => {
            this.validationErrors = err;
          }
        });
    }
  }
}
