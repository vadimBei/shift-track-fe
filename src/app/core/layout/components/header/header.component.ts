import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../../account/services/account.service';
import {RouterLink} from '@angular/router';
import {CurrentUser} from "../../../account/models/current-user.model";
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: CurrentUser | null = null;

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.currentUser = this.accountService.getCurrentUserFromLocalStorage();

    if (!this.currentUser) {
      this.accountService.getCurrentUser()
        .subscribe({
          next: (user) => {
            this.currentUser = user;
          },
          error: (error) => {
            console.error('Error fetching user:', error);
          }
        });
    }
  }

  logOut(): void {
    this.accountService.logout();
  }
}
