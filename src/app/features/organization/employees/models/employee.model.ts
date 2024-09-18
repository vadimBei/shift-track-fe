
import { EmployeeGender } from "../enums/employee-gender.enum";
import { Department } from "../../structure/models/department.model";
import { Position } from "../../structure/models/position.model";
import { Unit } from "../../structure/models/unit.model";

export interface Employee {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: Date;
    departmentId?: number;
    department?: Department;
    positionId?: number;
    position?: Position;
    gender: EmployeeGender;
}