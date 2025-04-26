import { inject, Injectable } from '@angular/core';
import { CreateEmployeeRoleRequest } from '../models/create-employee-role-request.model';
import { HttpClient } from '@angular/common/http';
import { EmployeeRole } from '../models/employee-role.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRolesService {
  private httpClient = inject(HttpClient);

  private path = 'system/user/employee-roles';

  create(request: CreateEmployeeRoleRequest) {
    return this.httpClient.post<EmployeeRole>(this.path, request);
  }

  getEmployeeRolesByEmployeeId(employeeId: number){
    return this.httpClient.get<EmployeeRole[]>(this.path + `/by-employeeId/${employeeId}`);
  }

  delete(id: number){
    return this.httpClient.delete(this.path + `/${id}`);
  }
}
