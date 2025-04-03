import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';
import { CreateShiftRequest } from '../models/create-shift-request.model';
import { EditShiftRequest } from '../models/edit-shift-request.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private httpClient = inject(HttpClient);

  private path = 'timesheet/shifts';

  constructor() { }

  getShifts() {
    return this.httpClient.get<Shift[]>(this.path);
  }

  deleteShift(shiftId: number) {
    return this.httpClient.delete(this.path + `/${shiftId}`);
  }

  createShift(request: CreateShiftRequest) {
    return this.httpClient.post<Shift>(this.path, request);
  }

  getShiftById(shiftId: number) {
    return this.httpClient.get<Shift>(this.path + `/${shiftId}`);
  }

  updateShift(request: EditShiftRequest){
    return this.httpClient.put<Shift>(this.path, request);
  }
}
