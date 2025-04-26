import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private httpClient = inject(HttpClient);

  private path = 'system/user/roles';
  
  getRoles(){
    return this.httpClient.get<Role[]>(this.path);
  }
}
