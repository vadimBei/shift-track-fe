import { Unit } from "../../../features/organization/structure/models/unit.model";
import { RoleScope } from "../enums/role-scope.enum";
import { EmployeeRoleUnitDepartment } from "./employee-role-unit-department.model";

export interface EmployeeRoleUnit {
    id: number;
    scope: RoleScope;
    unit: Unit;
    departments: EmployeeRoleUnitDepartment[];
}