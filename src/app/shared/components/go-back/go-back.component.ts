import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-back',
  standalone: true,
  imports: [
  ],
  templateUrl: './go-back.component.html',
  styleUrl: './go-back.component.scss'
})
export class GoBackComponent {
  @Input({ required: true }) path!: string;

  router = inject(Router);

  onClickBack() {
    this.router.navigateByUrl(this.path);
  }
}
