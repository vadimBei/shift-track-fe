export interface CreateEmployeeRoleRequest {
    employeeId: number;
    roleId: number;
    unitId?: number;
    departmentIds: number[];
}