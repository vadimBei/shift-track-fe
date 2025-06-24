import { Component } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Табель',
      icon: 'bi bi-calendar',
      link: '/timesheet'
    },
    {
      label: 'Відпустки',
      icon: 'bi bi-airplane',
      link: '/vacations'
    },
    {
      label: 'Відрядження',
      icon: 'bi bi-briefcase',
      link: '/trips'
    },
    {
      label: 'Довідник',
      icon: 'bi bi-journal-text',
      link: '/employees/contact-list'
    },
    {
      label: 'Адміністрування',
      icon: 'bi bi-person-gear',
      link: '/administration'
    }
  ]

  getMenuIconSrc(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }
}
