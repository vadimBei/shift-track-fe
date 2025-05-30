import { Component } from '@angular/core';
import { AdministrationItem } from '../../models/administration-item.model';
import { RouterLink

 } from '@angular/router';
import {NgClass} from "@angular/common";
@Component({
  selector: 'app-administration-page',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './administration-page.component.html',
  styleUrl: './administration-page.component.scss'
})
export class AdministrationPageComponent {
  administrations: AdministrationItem[] = [
    {
      title: 'Регіони',
      path: '/administration/units',
      icon: 'bi bi-pin-map',
    },
    {
      title: 'Департаменти',
      path: '/administration/departments',
      icon: 'bi bi-shop',
    },
    {
      title: 'Посади',
      path: '/administration/positions',
      icon: 'bi bi-person-workspace',
    },
    {
      title: 'Працівники',
      path: '/administration/employees',
      icon: 'bi bi-people'
    },
    {
      title: 'Робочі зміни',
      path: '/administration/shifts',
      icon: 'bi bi-calendar-week',
    },
    {
      title: 'Ролі працівників',
      path: '/administration/employees-roles',
      icon: 'bi bi-person-rolodex',
    }
  ]
}
