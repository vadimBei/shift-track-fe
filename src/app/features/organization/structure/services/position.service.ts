import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatePositionRequest } from '../models/create-position-request.model';
import { EditPositionRequest } from '../models/edit-position-request.model';
import { Position } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private httpClient = inject(HttpClient);

  private path = 'organization/structure/positions';

  constructor() { }

  createPosition(request: CreatePositionRequest) {
    return this.httpClient.post<Position>(this.path, request);
  }

  updatePosition(request: EditPositionRequest) {
    return this.httpClient.put<Position>(this.path, request);
  }

  getPositions() {
    return this.httpClient.get<Position[]>(this.path);
  }

  getPositionById(id: number) {
    return this.httpClient.get<Position>(this.path + `/${id}`);
  }

  deletePosition(id: number) {
    return this.httpClient.delete(this.path + `/${id}`);
  }
}
