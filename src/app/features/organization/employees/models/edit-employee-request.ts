import { EmployeeGender } from "../enums/employee-gender.enum";

export interface EditEmployeeRequest {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    departmentId?: number;
    positionId?: number;
    dateOfBirth?: Date;
    gender: EmployeeGender;
}
