export interface ChangePasswordRequest {
  employeeId: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
