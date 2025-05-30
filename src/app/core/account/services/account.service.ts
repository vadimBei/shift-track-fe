import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {Token} from '../models/token.model';
import {catchError, map, Observable, of, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {CurrentUser} from '../models/current-user.model';
import {CreateUserRequest} from '../models/create-user-request.model';
import {Employee} from '../../../features/organization/employees/models/employee.model';
import {EditAccountRequest} from '../models/edit-account-request.model';
import {ChangePasswordRequest} from "../models/change-password-request.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  token = signal<Token | null>(null);

  constructor() {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      this.token.set(JSON.parse(storedToken));
    }
  }

  private loadCurrentUser() {
    this.httpClient.get<CurrentUser>('system/account/current-user')
      .subscribe({
        next: (user) => {
          this.setCurrentUser(user);
        },
      });
  }

  private setCurrentUser(user: CurrentUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUserFromLocalStorage(): CurrentUser | null {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
    return null;
  }

  getCurrentUser(): Observable<CurrentUser | null> {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        return of(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }

    return this.httpClient.get<CurrentUser>('system/account/current-user')
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
        }),
        catchError(error => {
          console.error('Error fetching user data:', error);
          return throwError(() => error);
        })
      );
  }


  login(model: any) {
    return this.httpClient.post<Token>(`system/auth/token/generate`, model)
      .pipe(
        map((token) => {
          if (token.tokenType && token.accessToken && token.refreshToken) {
            this.setToken(token);
            this.loadCurrentUser();
          }
        })
      );
  }

  setToken(token: Token) {
    localStorage.setItem('token', JSON.stringify(token));

    this.token.set(token);
  }

  register(request: CreateUserRequest) {
    return this.httpClient.post<Token>(`system/account/register`, request)
      .pipe(
        map((token) => {
          if (token.tokenType && token.accessToken && token.refreshToken) {
            this.setToken(token);
            this.loadCurrentUser();
          }
        })
      )
  }

  refreshToken() {
    return this.httpClient.post<Token>(
      `system/auth/token/refresh`,
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
    localStorage.removeItem('currentUser');
    this.token.set(null);
    this.router.navigate(['/account/login']);
  }

  updateAccount(request: EditAccountRequest) {
    return this.httpClient.put<Employee>('system/account', request)
      .pipe(
        tap(() => {
          this.loadCurrentUser();
        })
      );
  }

  changePassword(request: ChangePasswordRequest) {
    return this.httpClient.post<Token>(`system/auth/password/change`, request)
      .pipe(
        map((token) => {
          if (token.tokenType && token.accessToken && token.refreshToken) {
            this.setToken(token);
            this.loadCurrentUser();
          }
        })
      );
  }
}
