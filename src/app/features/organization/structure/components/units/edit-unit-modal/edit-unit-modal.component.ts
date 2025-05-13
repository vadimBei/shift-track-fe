import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Unit} from '../../../models/unit.model';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditUnitRequest} from '../../../models/edit-unit-request.model';
import {UnitService} from '../../../services/unit.service';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-edit-unit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-unit-modal.component.html',
  styleUrl: './edit-unit-modal.component.scss'
})
export class EditUnitModalComponent implements OnInit, OnDestroy {
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

  request = signal<EditUnitRequest>(
    {
      id: 0,
      name: '',
      description: '',
      code: ''
    }
  );

  unit?: Unit;

  ngOnInit(): void {
    this.getUnitById();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUnitById() {
    this.unitService.getUnitById(this.unit!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => this.updateFormWithUnitData(unit));
  }

  updateFormWithUnitData(unit: Unit) {
    this.form.patchValue({
      code: unit.code,
      name: unit.name,
      description: unit.description
    });
  }

  updateUnit() {
    if (!this.request)
      return;

    this.request.update(value => ({
      ...value,
      id: this.unit!.id,
      name: this.form.value.name,
      description: this.form.value.description,
      code: this.form.value.code,
    }));

    this.unitService.updateUnit(this.request())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (unit) => {
          this.bsModalRef.hide();
        },
        error: err => {
          console.error('updating unit error', err);
        }
      });
  }
}
