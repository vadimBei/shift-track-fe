import {VacationStatus} from "../enums/vacation-status.enum";

export interface AllVacationsRequest {
  unitId?: number;
  departmentId?: number;
  searchPattern?: string;
  vacationStatus?: VacationStatus;
}
