import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Token } from '../models/token.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CurrentUser } from '../models/current-user.model';
import { CreateUserRequest } from '../models/create-user-request.model';
import { Employee } from '../../../features/organization/employees/models/employee.model';
import { EditAccountRequest } from '../models/edit-account-request.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  token = signal<Token | null>(null);
  currentUser = signal<CurrentUser | null>(null);

  constructor() {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      this.token.set(JSON.parse(storedToken));
    }
  }

  login(model: any) {
    return this.httpClient.post<Token>(`system/auth/tokens/generate`, model)
      .pipe(
        map((tooken) => {
          if (tooken.tokenType && tooken.accessToken && tooken.refreshToken) {
            this.setToken(tooken);
          }
        })
      );
  }

  setToken(token: Token) {
    localStorage.setItem('token', JSON.stringify(token));

    this.token.set(token);
  }

  register(request: CreateUserRequest) {
    return this.httpClient.post<Token>(`system/user/employees/register`, request)
      .pipe(
        map((tooken) => {
          if (tooken.tokenType && tooken.accessToken && tooken.refreshToken) {
            this.setToken(tooken);
          }
        })
      )
  }

  refreshToken() {
    return this.httpClient.post<Token>(
      `system/auth/tokens/refresh`,
      {
        refreshToken: this.token()?.refreshToken
      })
      .pipe(
        tap(value => {
          this.setToken(value);
        }),
        catchError(err => {
          this.logout();

          return throwError(() => new Error(err));
        })
      );
  }

  logout() {
    localStorage.removeItem('token');

    this.token.set(null);
    this.router.navigate(['/account/login']);
  }

  getCurrentUser() {
    return this.httpClient.get<CurrentUser>('system/user/employees/current');
  }

  updateAccount(request: EditAccountRequest) {
    return this.httpClient.put<Employee>('system/user/employees', request);
  }
}
