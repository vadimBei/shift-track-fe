import {Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../../services/account.service";
import {EmployeeRolesService} from "../../services/employee-roles.service";
import {Employee} from "../../../../features/organization/employees/models/employee.model";
import {EmployeeRole} from "../../models/employee-role.model";
import {RoleScope} from "../../enums/role-scope.enum";
import {CommonModule} from "@angular/common";
import {BsModalService} from 'ngx-bootstrap/modal';
import {
  ProfilePhotoConfirmationModalComponent
} from "../../components/profile-photo-confirmation-modal/profile-photo-confirmation-modal.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private modalService = inject(BsModalService);
  private employeeRolesService = inject(EmployeeRolesService);

  employee = signal<Employee | null>(null);
  employeeRoles = signal<EmployeeRole[]>([]);
  profilePhotoUrl = signal<string>('/assets/images/profile.png');

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  private loadCurrentEmployee() {
    this.accountService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currentUser) => {
          if (currentUser && currentUser.employee) {
            this.employee.set(currentUser.employee);
            this.getUserPhoto(currentUser.employee.id);
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

  getRoleScopeString(roleScope: RoleScope) {
    switch (roleScope) {
      case RoleScope.local:
        return 'Локальна';
      case RoleScope.global:
        return 'Глобальна';
      default:
        return '';
    }
  }

  getEmptyRows(departmentsLength: number): number[] {
    return Array(Math.max(0, departmentsLength - 1)).fill(0);
  }

  getUserPhoto(employeeId: number) {
    this.accountService.getProfilePhoto(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.body) {
            const blob = response.body;
            const url = URL.createObjectURL(blob);
            this.profilePhotoUrl.set(url);
          }
        }
      });
  }

  triggerFileInput(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Будь ласка, виберіть файл зображення');
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('Розмір файлу не повинен перевищувати 5MB');
          return;
        }

        this.openPhotoPreview(file);
      }
    };

    input.click();
  }

  private openPhotoPreview(file: File): void {
    const modalRef = this.modalService.show(ProfilePhotoConfirmationModalComponent, {
      class: 'modal-lg'
    });

    const component = modalRef.content as ProfilePhotoConfirmationModalComponent;
    if (component) {
      component.setImage(file);
      component.onClose.subscribe((selectedFile: File) => {
        this.uploadPhoto(selectedFile);
      });
    }
  }

  private uploadPhoto(file: File): void {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('EmployeeId', this.employee()?.id?.toString() ?? '0');

    this.accountService.uploadProfilePhoto(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const employeeId = this.employee()?.id;
          if (employeeId) {
            this.getUserPhoto(employeeId);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
