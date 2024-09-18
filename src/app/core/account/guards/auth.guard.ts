import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "../services/account.service";

export const authGuard: CanActivateFn = (route, state) => {
    const accountService = inject(AccountService);

    if (accountService.token()) {
        return true;
    }
    else {
        console.error('Помилка аутентифікації');

        return inject(Router).createUrlTree(['/account/login']);
    }
} 