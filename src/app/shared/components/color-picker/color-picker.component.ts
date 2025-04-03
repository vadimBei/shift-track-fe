import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent {
  @Input() color: string = '#ffffff';
  @Output() colorChange = new EventEmitter<string>();

  dropdownOpen = false;

  colors: string[] = [
    '#E57373', '#F06292', '#B66AC5', '#9675CE', '#7986CC',
    '#64B5F6', '#4FC2F8', '#4DD0E2', '#4CB6AC', '#80C783',
    '#AED584', '#DDE776', '#FFF176', '#FFD54D', '#FFB64D',
    '#FF8B66', '#A08780', '#E0E0E0', '#90A4AD', '#FFFFFF'
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectColor(color: string) {
    this.color = color;
    this.colorChange.emit(color);
    this.dropdownOpen = false;
  }
}
