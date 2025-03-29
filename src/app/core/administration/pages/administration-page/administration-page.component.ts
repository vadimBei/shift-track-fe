import { Component } from '@angular/core';
import { AdministrationItem } from '../../models/administration-item.model';
import { RouterLink

 } from '@angular/router';
@Component({
  selector: 'app-administration-page',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './administration-page.component.html',
  styleUrl: './administration-page.component.scss'
})
export class AdministrationPageComponent {
  administrations: AdministrationItem[] = [
    {
      title: 'Регіони',
      path: '/administration/units',
      icon: 'administration_units',
    },
    {
      title: 'Департаменти',
      path: '/administration/departments',
      icon: 'administration_departments',
    },
    {
      title: 'Посади',
      path: '/administration/positions',
      icon: 'administration_positions'
    },
    {
      title: 'Працівники',
      path: '/administration/employees',
      icon: 'administration_employees'
    },
    {
      title: 'Робочі зміни',
      path: '/administration/shifts',
      icon: 'administration_shifts',
    }
  ]

  getIconSrc(icon: string): string {
    return `/assets/icons/${icon}.svg`
  }
}
