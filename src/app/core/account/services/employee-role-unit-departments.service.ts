import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EmployeeRoleUnitDepartment} from "../models/employee-role-unit-department.model";
import {CreateEmployeeRoleUnitDepartmentRequest} from "../models/create-employee-role-unit-department-request.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleUnitDepartmentsService {
  private httpClient = inject(HttpClient);

  private path = 'system/user/employee-role-unit-departments';

  getByEmployeeRoleUnitId(employeeRoleUnitId: number){
    return this.httpClient.get<EmployeeRoleUnitDepartment[]>(this.path + `/by-employeeRoleUnitId/${employeeRoleUnitId}`);
  }

  delete(employeeRoleUnitDepartmentId: number){
    return this.httpClient.delete(this.path + `/${employeeRoleUnitDepartmentId}`);
  }

  create(request: CreateEmployeeRoleUnitDepartmentRequest){
    return this.httpClient.post<EmployeeRoleUnitDepartment>(this.path, request);
  }
}
