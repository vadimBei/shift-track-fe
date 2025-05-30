import { ShiftType } from "../enums/shift-type.enum";

export interface CreateShiftRequest {
    code: string,
    description: string,
    color: string,
    type: ShiftType,
    startTime?: string | null; 
    endTime?: string | null;
}