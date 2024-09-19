import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionService } from '../../../services/position.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EditPositionRequest } from '../../../models/edit-position-request.model';
import { Position } from '../../../models/position.model';

@Component({
  selector: 'app-edit-position-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-position-modal.component.html',
  styleUrl: './edit-position-modal.component.scss'
})
export class EditPositionModalComponent implements OnInit {
  fb = inject(FormBuilder);
  positionService = inject(PositionService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  request?: EditPositionRequest;
  position?: Position;

  constructor() {
  }

  ngOnInit(): void {
    this.request = {
      id: 0,
      name: '',
      description: ''
    }

    this.getPositionById();

    this.initializeForm(this.position!);
  }

  getPositionById() {
    this.positionService.getPositionById(this.position!.id)
      .subscribe(position => {
        this.position = position;
      });
  }

  initializeForm(position: Position) {
    this.form = this.fb.group({
      name: [
        position.name,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      description: [
        position.description,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  updatePosition(){
    if (!this.request)
      return;

    this.request.id = this.position!.id;
    this.request.name = this.form.value.name;
    this.request.description = this.form.value.description;

    this.positionService.updatePosition(this.request!)
    .subscribe({
      next: position => {
        this.bsModalRef.hide();
      },
      error: error => {
        console.error('updating position error', error);
      }
    })
  }
}
