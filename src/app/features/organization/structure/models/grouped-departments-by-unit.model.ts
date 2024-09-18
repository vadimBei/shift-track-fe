import { Department } from "./department.model";
import { Unit } from "./unit.model";

export interface GroupedDepartmentsByUnit{
    unit: Unit,
    departments: Department[]
}