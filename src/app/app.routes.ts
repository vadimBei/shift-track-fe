import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/components/layout/layout.component';
import { authGuard } from './core/account/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'employees',
        component: LayoutComponent,
        loadChildren: () => import("./features/organization/employees/employees.routes"),
        canActivate: [authGuard]
    },
    {
        path: 'trips',
        component: LayoutComponent,
        loadChildren: () => import("./features/booking/trips/trips.routes"),
        canActivate: [authGuard]
    },
    {
        path: 'account',
        loadChildren: () => import("./core/account/account.routes")
    },
    {
        path: 'timesheet',
        component: LayoutComponent,
        loadChildren: () => import("./features/organization/timesheet/timesheet.routes"),
        canActivate: [authGuard]
    },
    {
        path: 'administration',
        component: LayoutComponent,
        loadChildren: () => import("./core/administration/administration.routes"),
        canActivate: [authGuard]
    }

];
