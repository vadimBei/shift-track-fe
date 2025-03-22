import { Component, inject } from '@angular/core';
import { AccountService } from '../../../account/services/account.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  accountService = inject(AccountService);

  logOut() {
    this.accountService.logout();
  }
}
