import { EmployeeGender } from "../../../features/organization/employees/enums/employee-gender.enum";

export interface EditAccountRequest {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: Date;
    gender: EmployeeGender;
}