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
      label: 'Адміністрування',
      icon: 'bi bi-person-gear',
      link: '/administration'
    },
    {
      label: 'Відрядження',
      icon: 'bi bi-briefcase',
      link: '/trips'
    },
    {
      label: 'Табель',
      icon: 'bi bi-calendar',
      link: '/timesheet'
    },
    {
      label: 'Довідник',
      icon: 'bi bi-journal-text',
      link: '/employees/contact-list'
    }
  ]

  getMenuIconSrc(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }
}
