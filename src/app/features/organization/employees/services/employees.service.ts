import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { AllEmployeesRequest } from '../models/all-employees-request.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private httpClient = inject(HttpClient);

  private baseApiUrl = 'system/user/employees';

  getAllEmployees(request: AllEmployeesRequest) {
    let filter = new HttpParams();

    if (request !== undefined && request !== null) {
      if (request.unitId !== undefined && request.unitId !== null) {
        filter = filter.set('unitId', request.unitId);
      }

      if (request.searchPattern) {
        filter = filter.set('searchPattern', request.searchPattern);
      }
    }

    return this.httpClient.get<Employee[]>(`${this.baseApiUrl}`,
      {
        params: filter
      }
    );
  }
}
