import { Unit } from "./unit.model";

export interface Department {
    id: number;
    name: string;
    unitId?: number;
    unit?: Unit;
}