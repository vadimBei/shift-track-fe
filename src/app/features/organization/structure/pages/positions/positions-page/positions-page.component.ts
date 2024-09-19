import { Component, inject, OnInit } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';
import { PositionService } from '../../../services/position.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Position } from '../../../models/position.model';
import { CommonModule } from '@angular/common';
import { CreatePositionModalComponent } from '../../../components/positions/create-position-modal/create-position-modal.component';
import { EditPositionModalComponent } from '../../../components/positions/edit-position-modal/edit-position-modal.component';

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
    this.positionService.geyPositions()
      .subscribe(positions => {
        this.positoins$.next(positions);
      });
  }

  openCreatePositionModal() {
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered'
    }

    const ref = this.modalService.show(CreatePositionModalComponent, initialState);

    ref.onHidden?.subscribe({
      next: () => this.getPositions()
    });
  }

  openEditPositionModal(position: Position) {
    const initialState: ModalOptions = {
      class: 'modal modal-dialog-centered',
      initialState: {
        position: position
      }
    }

    const ref = this.modalService.show(EditPositionModalComponent, initialState);

    ref.onHidden?.subscribe({
      next: () => this.getPositions()
    });
  }
}
