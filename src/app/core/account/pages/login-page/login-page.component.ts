import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgModule} from '@angular/core';

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

export class LoginPageComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public form: FormGroup = new FormGroup({});
  isPasswordVisible = signal<boolean>(false);
  validationErrors?: string[];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      login: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,}$/)
      ]
      ]
    });
  }

  login() {
    if (this.form.valid) {
      this.accountService.login(this.form.value)
        .subscribe({
          next: () => this.router.navigateByUrl('/employees/contact-list'),
          error: err => {
            this.validationErrors = err;
          }
        });
    }
  }
}
