import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UnitService} from '../../../services/unit.service';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {CreateUnitRequest} from '../../../models/create-unit-request.model';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-create-unit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-unit-modal.component.html',
  styleUrl: './create-unit-modal.component.scss'
})
export class CreateUnitModalComponent {
  private readonly destroy$ = new Subject<void>();

  private readonly unitService = inject(UnitService);

  bsModalRef = inject(BsModalRef);

  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    code: [
      '',
      [
        Validators.required,
        Validators.maxLength(10)
      ]
    ],
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

  request = signal<CreateUnitRequest>(
    {
      name: '',
      description: '',
      code: ''
    }
  );

  createUnit() {
    if (!this.request)
      return;

    this.request.update(value => ({
      ...value,
      name: this.form.value.name,
      description: this.form.value.description,
      code: this.form.value.code,
    }));

    this.unitService.createUnit(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (unit) => {
          this.bsModalRef.hide();
        },
        error: error => {
          console.error('creating unit error', error);
        }
      });
  }
}
