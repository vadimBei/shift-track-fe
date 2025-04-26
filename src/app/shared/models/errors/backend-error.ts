export interface BackendError {
  code: number;
  errorType: string;
  errorMessage: string;
  validationErrors: any;
}
