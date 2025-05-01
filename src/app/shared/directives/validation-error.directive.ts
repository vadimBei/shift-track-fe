import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ErrorService } from '../services/error.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidationError]',
  standalone: true
})
export class ValidationErrorDirective implements OnInit, OnDestroy {
  @Input() fieldName: string = '';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private control = inject(NgControl);
  private errorService = inject(ErrorService);

  private subscription = new Subscription();
  private errorElement: HTMLElement | null = null;

  ngOnInit(): void {
    // Підписка на зміну стану контрола
    this.subscription.add(
      this.control.statusChanges?.subscribe(() => {
        this.updateErrorMessage();
      }) || new Subscription()
    );

    // Підписка на валідаційні помилки від сервера
    this.subscription.add(
      this.errorService.validationErrors$.subscribe(errors => {
        if (this.fieldName && errors && errors[this.fieldName]) {
          this.showServerError(errors[this.fieldName]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateErrorMessage(): void {
    // Спочатку видаляємо старі помилки
    this.removeErrorElement();

    // Перевіряємо, чи контрол є брудним/торканим і невалідним
    if (this.control && this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      if (errors) {
        let errorMessage = '';

        // Формуємо повідомлення про помилку на основі типу помилки
        if (errors['required']) {
          errorMessage = 'Це поле обов\'язкове';
        } else if (errors['email']) {
          errorMessage = 'Введіть коректну email адресу';
        } else if (errors['minlength']) {
          const requiredLength = errors['minlength'].requiredLength;
          errorMessage = `Мінімальна довжина: ${requiredLength} символів`;
        } else if (errors['maxlength']) {
          const requiredLength = errors['maxlength'].requiredLength;
          errorMessage = `Максимальна довжина: ${requiredLength} символів`;
        } else if (errors['pattern']) {
          errorMessage = 'Введене значення не відповідає необхідному формату';
        } else {
          // Якщо тип помилки невідомий, виводимо загальне повідомлення
          errorMessage = 'Невірне значення';
        }

        this.showError(errorMessage);
      }
    }
  }

  private showServerError(errors: string[]): void {
    this.removeErrorElement();
    if (errors && errors.length > 0) {
      // Використовуємо перше повідомлення про помилку
      this.showError(errors[0]);

      // Також позначаємо поле як невалідне
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
    }
  }

  private showError(message: string): void {
    // Створюємо елемент для відображення помилки
    this.errorElement = this.renderer.createElement('div');
    this.renderer.addClass(this.errorElement, 'invalid-feedback');
    this.renderer.setProperty(this.errorElement, 'textContent', message);

    // Додаємо клас is-invalid до елемента форми
    this.renderer.addClass(this.el.nativeElement, 'is-invalid');

    // Додаємо елемент з помилкою після елемента форми
    const parent = this.renderer.parentNode(this.el.nativeElement);
    this.renderer.appendChild(parent, this.errorElement);
  }

  private removeErrorElement(): void {
    // Видаляємо попередній елемент з помилкою, якщо він існує
    if (this.errorElement) {
      const parent = this.renderer.parentNode(this.el.nativeElement);
      this.renderer.removeChild(parent, this.errorElement);
      this.errorElement = null;
    }

    // Видаляємо клас is-invalid
    this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
  }
}
