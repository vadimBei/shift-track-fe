import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ErrorService} from "../../services/error.service";
import {Subscription} from "rxjs";
import {ErrorNotification} from "../../models/errors/error-notification";
import {ErrorType} from "../../enums/error-type.enum";

@Component({
  selector: 'app-error-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ],
  templateUrl: './error-notification.component.html',
  styleUrl: './error-notification.component.scss'
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  private errorService = inject(ErrorService);
  private subscription = new Subscription();

  currentError: ErrorNotification | null = null;
  private autoHideTimeout: any = null;

  ngOnInit(): void {
    this.subscription.add(
      this.errorService.errors$
        .subscribe(error => {
          this.currentError = error;
          this.setupAutoHide();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  dismissError(): void {
    this.currentError = null;
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  private setupAutoHide(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }

    this.autoHideTimeout = setTimeout(() => {
      this.currentError = null;
    }, 5000);
  }

  protected readonly ErrorType = ErrorType;
}

