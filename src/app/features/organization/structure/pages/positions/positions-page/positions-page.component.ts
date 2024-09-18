import { Component } from '@angular/core';
import { GoBackComponent } from '../../../../../../shared/components/go-back/go-back.component';

@Component({
  selector: 'app-positions-page',
  standalone: true,
  imports: [
    GoBackComponent
  ],
  templateUrl: './positions-page.component.html',
  styleUrl: './positions-page.component.scss'
})
export class PositionsPageComponent {

}
