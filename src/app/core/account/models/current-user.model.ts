import { Employee } from "../../../features/organization/employees/models/employee.model";

export interface CurrentUser {
    employee: Employee,
    roles: string[]
}