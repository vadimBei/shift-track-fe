import { Component, inject, OnInit } from '@angular/core';
import { UnitService } from '../../../services/unit.service';
import { Subject } from 'rxjs';
import { Unit } from '../../../models/unit.model';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EditUnitModalComponent } from '../../../components/units/edit-unit-modal/edit-unit-modal.component';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { CreateUnitModalComponent } from '../../../components/units/create-unit-modal/create-unit-modal.component';

@Component({
  selector: 'app-units-page',
  standalone: true,
  imports: [
    CommonModule,
    GoBackComponent
  ],
  templateUrl: './units-page.component.html',
  styleUrl: './units-page.component.scss'
})
export class UnitsPageComponent implements OnInit {
  readonly unitService = inject(UnitService);
  readonly modalService = inject(BsModalService);
  units$: Subject<Unit[]> = new Subject<Unit[]>();

  ngOnInit(): void {
    this.getUnits();
  }

  getUnits() {
    this.unitService.getUnits()
      .subscribe(units => {
        this.units$.next(units);
      });
  }

  openEditUnitModal(unit: Unit) {
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered',
      initialState: {
        title: 'Редагування регіону',
        unit: unit
      }
    }

    const ref = this.modalService.show(EditUnitModalComponent, initialState);
    
    ref.onHidden?.subscribe({
      next: () => this.getUnits()
    })
  }

  openCreateUnitModal(){
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered',
      initialState: {
        title: 'Створення регіону'
      }
    }

    const ref = this.modalService.show(CreateUnitModalComponent, initialState);

    ref.onHidden?.subscribe({
      next: () => this.getUnits()
    })
  }
}
