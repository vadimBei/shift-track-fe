import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorChromeModule } from 'ngx-color/chrome';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    FormsModule,
    ColorChromeModule
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent {
  color: any = {
    hex: '#FFFFFF'
  };

  onColorChangeComplete(event: any): void {
    console.log('Обраний колір:', event.color.hex);  // Передаємо значення у форматі HEX
  }
}
