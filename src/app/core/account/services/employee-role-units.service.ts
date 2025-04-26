import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EmployeeRoleUnit} from "../models/employee-role-unit.model";
import {CreateEmployeeRoleUnitRequest} from "../models/create-employee-role-unit-request.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleUnitsService {
  private httpClient = inject(HttpClient);

  private path = 'system/user/employee-role-units';

  getByEmployeeRoleId(employeeRoleId: number){
    return this.httpClient.get<EmployeeRoleUnit[]>(this.path + `/by-employeeRoleId/${employeeRoleId}`);
  }

  getById(employeeRoleUnitId: number){
    return this.httpClient.get<EmployeeRoleUnit>(this.path + `/${employeeRoleUnitId}`);
  }

  deleteById(employeeRoleUnitId: number){
    return this.httpClient.delete(this.path + `/${employeeRoleUnitId}`);
  }

  create(request: CreateEmployeeRoleUnitRequest){
    return this.httpClient.post<EmployeeRoleUnit>(this.path, request);
  }
}
