import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {BackendError} from '../models/errors/backend-error';
import {ErrorNotification} from "../models/errors/error-notification";
import {ErrorTranslations} from "../constants/error-translations";
import {ErrorType} from "../enums/error-type.enum";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<ErrorNotification>();
  public errors$ = this.errorSubject.asObservable();

  public latestError = signal<ErrorNotification | null>(null);

  private validationErrorsSubject = new Subject<Record<string, string[]>>();
  public validationErrors$ = this.validationErrorsSubject.asObservable();

  constructor() {}

  handleError(message: string, type: ErrorType = ErrorType.error): void {
    const notification: ErrorNotification = {
      message,
      type,
      timestamp: new Date()
    };

    this.errorSubject.next(notification);
    this.latestError.set(notification);
  }

  handleBackendError(error: BackendError): void {
    let translatedMessage = error.ErrorMessage;

    if (error.ErrorType && ErrorTranslations[error.ErrorType]) {
      const errorTypeTranslation = ErrorTranslations[error.ErrorType];

      translatedMessage = `${errorTypeTranslation}`;
    }

    this.handleError(translatedMessage);

    if (error.ValidationErrors) {
      console.log('Validation errors:', error.ValidationErrors);
    }
  }

  handleValidationError(validationErrors: Record<string, string[]>): void {
    this.validationErrorsSubject.next(validationErrors);

    this.handleError('Перевірте коректність введених даних', ErrorType.warning);
  }

  clearError(): void {
    this.latestError.set(null);
  }
}
