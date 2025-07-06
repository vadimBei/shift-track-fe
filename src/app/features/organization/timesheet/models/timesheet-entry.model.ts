import {Shift} from "./shift.model";

export interface TimesheetEntry {
  employeeId: number;
  date: Date;
  shift: Shift;
}
