import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private httpClient = inject(HttpClient);

  private path = 'organization/structure/positions';


  constructor() { }
}
