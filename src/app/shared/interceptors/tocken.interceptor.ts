import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AccountService } from "../../core/account/services/account.service";
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from "rxjs";

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);

    var accessToken = accountService.token()?.accessToken;

    if (!accessToken) {
        return next(req);
    }
    
    if (isRefreshing$.value) {
        return refreshTokenAndProceed(accountService, req, next);
    }

    return next(addToken(req, accessToken))
        .pipe(
            catchError(error => {
                debugger
                if (error.status === 401) {
                    return refreshTokenAndProceed(accountService, req, next);
                }

                return throwError(() => error);
            })
        )
}

const addToken = (
    req: HttpRequest<any>,
    accessToken: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

const refreshTokenAndProceed = (
    accountService: AccountService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    if (!isRefreshing$.value) {
        isRefreshing$.next(true);

        return accountService.refreshToken()
            .pipe(
                switchMap(token => {
                    return next(addToken(req, token.accessToken))
                        .pipe(
                            tap(() => isRefreshing$.next(false))
                        );
                })
            );
    }

    if (req.url.includes('refresh')) {
        return next(addToken(req, accountService.token()?.accessToken!));
    }

    return isRefreshing$.pipe(
        filter(isRefreshing => !isRefreshing),
        switchMap(res => {
            return next(addToken(req, accountService.token()?.accessToken!));
        })
    );
}
