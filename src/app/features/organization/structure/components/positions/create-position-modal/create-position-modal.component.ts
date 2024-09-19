import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreatePositionRequest } from '../../../models/create-position-request.model';
import { PositionService } from '../../../services/position.service';

@Component({
  selector: 'app-create-position-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-position-modal.component.html',
  styleUrl: './create-position-modal.component.scss'
})
export class CreatePositionModalComponent implements OnInit {
  fb = inject(FormBuilder);
  positionService = inject(PositionService);
  bsModalRef = inject(BsModalRef);
  form: FormGroup = new FormGroup({});
  request?: CreatePositionRequest;

  ngOnInit(): void {
    this.request = {
      name: '',
      description: ''
    }

    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  createPosition() {
    if (!this.request)
      return;

    this.request.name = this.form.value.name;
    this.request.description = this.form.value.description;

    this.positionService.createPosition(this.request!)
      .subscribe({
        next: (position) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('creating unit error', error);
        }
      });
  }
}
