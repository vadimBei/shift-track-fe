import { Component, inject, OnInit } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { DepartmentService } from '../../../services/department.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Department } from '../../../models/department.model';
import { CommonModule } from '@angular/common';
import { GroupedDepartmentsByUnit } from '../../../models/grouped-departments-by-unit.model';
import { EditDepartmentModalComponent } from '../../../components/departments/edit-department-modal/edit-department-modal.component';
import { CreateDepartmentModalComponent } from '../../../components/departments/create-department-modal/create-department-modal.component';

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
  readonly depaermentService = inject(DepartmentService);
  readonly modalService = inject(BsModalService);

  groupedDepartments$: Subject<GroupedDepartmentsByUnit[]> = new Subject<GroupedDepartmentsByUnit[]>();

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.depaermentService.getGroupedDepartmentsByUnit()
      .subscribe(departments => {
        this.groupedDepartments$.next(departments);
      })
  }
  
  openCreateDepartmentModal() {
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered',
      initialState: {
        title: 'Створення департаменту',
      }
    }

    const ref = this.modalService.show(CreateDepartmentModalComponent, initialState);
    
    ref.onHidden?.subscribe({
      next: () => this.getDepartments()
    })
  }

  openEditDepartmentModal(department: Department) {
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered',
      initialState: {
        department: department,
      }
    }

    const ref = this.modalService.show(EditDepartmentModalComponent, initialState);
    
    ref.onHidden?.subscribe({
      next: () => this.getDepartments()
    })
  }
}
