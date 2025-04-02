import { Component, inject, OnInit } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { DepartmentService } from '../../../services/department.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Department } from '../../../models/department.model';
import { CommonModule } from '@angular/common';
import { GroupedDepartmentsByUnit } from '../../../models/grouped-departments-by-unit.model';
import { EditDepartmentModalComponent } from '../../../components/departments/edit-department-modal/edit-department-modal.component';
import { CreateDepartmentModalComponent } from '../../../components/departments/create-department-modal/create-department-modal.component';
import { DeleteConfirmationModalComponent } from '../../../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-departments-page',
  standalone: true,
  imports: [
    CommonModule,
    GoBackComponent
  ],
  templateUrl: './departments-page.component.html',
  styleUrl: './departments-page.component.scss'
})
export class DepartmentsPageComponent implements OnInit {
  readonly departmentService = inject(DepartmentService);
  readonly modalService = inject(BsModalService);

  groupedDepartments$: Subject<GroupedDepartmentsByUnit[]> = new Subject<GroupedDepartmentsByUnit[]>();

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.getGroupedDepartmentsGroupedByUnits()
      .subscribe(departments => {
        this.groupedDepartments$.next(departments);
      })
  }

  openCreateDepartmentModal() {
    const ref = this.modalService.show(CreateDepartmentModalComponent, 
      {
        class: 'modal modal-dialog-centered',
        initialState: {
        }
      }
    );

    ref.onHidden?.subscribe({
      next: () => this.getDepartments()
    })
  }

  openEditDepartmentModal(department: Department) {
    const ref = this.modalService.show(
      EditDepartmentModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          department: department,
        }
      });

    ref.onHidden?.subscribe({
      next: () => this.getDepartments()
    })
  }

  openDeleteConfirmation(department: Department): void {
    this.modalService.show(
      DeleteConfirmationModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          itemName: department.name,
          entityName: 'департамент',
          onConfirm: () => this.deleteDepartment(department.id)
        }
      });
  }

  deleteDepartment(departmentId: number) {
    this.departmentService.deleteDepartment(departmentId)
      .subscribe({
        next: () => {
          this.getDepartments();
        }
      })
  }
}
