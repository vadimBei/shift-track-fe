import { Component, inject, OnInit } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { PositionService } from '../../../services/position.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Position } from '../../../models/position.model';
import { CommonModule } from '@angular/common';
import { CreatePositionModalComponent } from '../../../components/positions/create-position-modal/create-position-modal.component';
import { EditPositionModalComponent } from '../../../components/positions/edit-position-modal/edit-position-modal.component';
import { DeleteConfirmationModalComponent } from '../../../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-positions-page',
  standalone: true,
  imports: [
    CommonModule,
    GoBackComponent
  ],
  templateUrl: './positions-page.component.html',
  styleUrl: './positions-page.component.scss'
})
export class PositionsPageComponent implements OnInit {
  readonly positionService = inject(PositionService);
  readonly modalService = inject(BsModalService);

  positoins$: Subject<Position[]> = new Subject<Position[]>();

  ngOnInit(): void {
    this.getPositions();
  }

  getPositions() {
    this.positionService.getPositions()
      .subscribe(positions => {
        this.positoins$.next(positions);
      });
  }

  openCreatePositionModal() {
    const ref = this.modalService.show(
      CreatePositionModalComponent,
      {
        class: 'modal modal-dialog-centered'
      });

    ref.onHidden?.subscribe({
      next: () => this.getPositions()
    });
  }

  openEditPositionModal(position: Position) {
    const ref = this.modalService.show(
      EditPositionModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          position: position
        }
      });

    ref.onHidden?.subscribe({
      next: () => this.getPositions()
    });
  }

  openDeleteConfirmation(position: Position): void {
    this.modalService.show(DeleteConfirmationModalComponent,
      {
        class: 'modal modal-dialog-centered',
        initialState: {
          itemName: position.name,
          entityName: 'посаду',
          onConfirm: () => this.deletePosition(position.id)
        }
      });
  }

  deletePosition(positionId: number) {
    this.positionService.deletePosition(positionId)
      .subscribe({
        next: () => this.getPositions()
      })
  }
}
