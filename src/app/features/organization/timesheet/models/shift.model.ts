import { ShiftType } from "../enums/shift-type.enum";

export interface Shift {
    id: number,
    code: string,
    description: string,
    color: string,
    type: ShiftType
}