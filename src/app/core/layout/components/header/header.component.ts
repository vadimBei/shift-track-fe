import { Component, inject } from '@angular/core';
import { AccountService } from '../../../account/services/account.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
 accountService = inject(AccountService);

 logOut(){
  this.accountService.logout();
 }
}
