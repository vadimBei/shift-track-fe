import { RoleScope } from "../enums/role-scope.enum";
import { EmployeeRoleUnit } from "./employee-role-unit.model";
import { Role } from "./role.model";

export interface EmployeeRole {
    id: number;
    scope: RoleScope;
    role: Role;
    units: EmployeeRoleUnit[];
}