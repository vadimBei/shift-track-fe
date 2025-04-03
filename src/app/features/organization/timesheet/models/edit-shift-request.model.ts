import { ShiftType } from "../enums/shift-type.enum";

export interface EditShiftRequest {
    id: number,
    code: string,
    description: string,
    color: string,
    type: ShiftType
}