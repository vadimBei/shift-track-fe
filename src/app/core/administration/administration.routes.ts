import { Routes } from "@angular/router";
import { UnitsPageComponent } from "../../features/organization/structure/pages/units/units-page/units-page.component";
import { AdministrationPageComponent } from "./pages/administration-page/administration-page.component";
import { DepartmentsPageComponent } from "../../features/organization/structure/pages/departments/departments-page/departments-page.component";
import { TimesheetShiftsPageComponent } from "../../features/organization/timesheet/pages/timesheet-shifts-page/timesheet-shifts-page.component";
import { EditEmployeeComponent } from "../../features/organization/employees/pages/edit-employee/edit-employee.component";
import { PositionsPageComponent } from "../../features/organization/structure/pages/positions/positions-page/positions-page.component";

const routes: Routes = [
    {
        path: '',
        component: AdministrationPageComponent
    },
    {
        path: 'units',
        component: UnitsPageComponent
    },
    {
        path: 'departments',
        component: DepartmentsPageComponent
    },
    {
        path: 'shifts',
        component: TimesheetShiftsPageComponent
    },
    {
        path: 'profile',
        component: EditEmployeeComponent
    },
    {
        path: 'positions',
        component: PositionsPageComponent
    }
]

export default routes;