export interface BackendError {
  Code: number;
  ErrorType: string;
  ErrorMessage: string;
  ValidationErrors: any;
}
