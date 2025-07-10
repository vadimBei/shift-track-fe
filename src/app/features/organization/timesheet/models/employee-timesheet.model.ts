import {Shift} from "./shift.model";

export interface EmployeeTimesheet {
  employeeId: number;
  shifts: (Shift | null)[];
  totalWorkDays: number;
  totalWorkHours: number;
}
