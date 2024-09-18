import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Token } from '../models/token.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CurrentUser } from '../models/current-user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  token = signal<Token | null>(null);
  currentUser = signal<CurrentUser | null>(null);

  constructor() {
    this.currentUser();

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
            this.setCurrentUser(tooken);
          }
        })
      );
  }

  setCurrentUser(token: Token) {
    localStorage.setItem('token', JSON.stringify(token));

    this.token.set(token);
  }

  register(model: any) {
    return this.httpClient.post<Token>(`system/user/employees`, model)
      .pipe(
        map((tooken) => {
          if (tooken.tokenType && tooken.accessToken && tooken.refreshToken) {
            this.setCurrentUser(tooken);
          }
        })
      )
  }

  refreshToken(): Observable<Token> {
    return this.httpClient.post<Token>(
      `system/auth/tokens/refresh`,
      {
        refreshToken: this.token()?.refreshToken
      }).pipe(
        tap(value => {
          this.setCurrentUser(value);
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

  getCurrentUser(): Observable<CurrentUser> {
    return this.httpClient.get<CurrentUser>('system/user/employees/current')
      .pipe(
        tap(currentUser => {
          this.currentUser.set(currentUser);
        }),
        catchError(err => {
          return throwError(() => new Error(err));
        })
      );
  }
}
