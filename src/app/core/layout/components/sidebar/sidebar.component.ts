import { Component } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Адміністрування',
      icon: 'administration',
      link: '/administration'
    },
    {
      label: 'Табель',
      icon: 'board',
      link: '/timesheet'
    },
    {
      label: 'Відрядження',
      icon: 'trip',
      link: '/trips'
    },
    {
      label: 'Довідник',
      icon: 'addressBook',
      link: '/employees/contact-list'
    },
  ]

  getMenuIconSrc(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }
}
