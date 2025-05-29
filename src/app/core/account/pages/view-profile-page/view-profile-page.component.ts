import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../../services/account.service";
import {Employee} from "../../../../features/organization/employees/models/employee.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeeRolesService} from "../../services/employee-roles.service";
import {EmployeeRole} from "../../models/employee-role.model";
import {RoleScope} from "../../enums/role-scope.enum";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-view-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './view-profile-page.component.html',
  styleUrl: './view-profile-page.component.scss'
})
export class ViewProfilePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private employeeRolesService = inject(EmployeeRolesService);

  employee = signal<Employee | null>(null);
  employeeRoles = signal<EmployeeRole[]>([]);

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  private loadCurrentEmployee() {
    this.accountService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (currentUser) => {
          if (currentUser && currentUser.employee) {
            this.employee.set(currentUser.employee);

            this.getEmployeeRolesByEmployeeId(currentUser.employee.id);
          }
        }
      });
  }

  private getEmployeeRolesByEmployeeId(employeeId: number) {
    this.employeeRolesService.getEmployeeRolesByEmployeeId(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeRoles) => this.employeeRoles.set(employeeRoles)
      });
  }

  getRoleScopeString(roleScope: RoleScope){
    if (roleScope === RoleScope.local)
      return `Локальна`;
    else
      return `Глобальна`;
  }

  getEmptyRows(departmentsLength: number): number[] {
    return Array(Math.max(0, departmentsLength - 1)).fill(0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
