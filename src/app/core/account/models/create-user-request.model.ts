import { EmployeeGender } from "../../../features/organization/employees/enums/employee-gender.enum";

export interface CreateUserRequest {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phoneNumber: string;
    gender: EmployeeGender;
    confirmPassword: string;
    password: string;
}