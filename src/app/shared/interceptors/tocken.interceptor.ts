import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AccountService } from "../../core/account/services/account.service";
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from "rxjs";
import { Token } from "../../core/account/models/token.model";

let isRefreshing = false;
let token$: BehaviorSubject<Token | null> = new BehaviorSubject<Token | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);

    const token = accountService.token();

    if (token) {
        req = addToken(req, token);
    }

    return next(req)
        .pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    if (req.url.includes('refresh')) {
                        accountService.logout();

                        return throwError(() => new Error('Refresh token expired or invalid, logging out'));
                    }

                    return handle401Error(req, next, accountService);
                }
                else {
                    return throwError(() => new Error());
                }
            })
        )
}

const addToken = (
    req: HttpRequest<any>,
    token: Token) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token.accessToken}`
        }
    });
}

const handle401Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    accountService: AccountService) => {
    if (!isRefreshing) {
        isRefreshing = true;
        token$.next(null);

        const refreshToken = accountService.token()?.refreshToken;
        debugger
        if (refreshToken) {
            return accountService.refreshToken()
                .pipe(
                    switchMap((token: Token) => {
                        isRefreshing = false;
                        token$.next(token);

                        return next(addToken(req, token));
                    }),
                    catchError((error) => {
                        isRefreshing = false;
                        accountService.logout();
                        debugger
                        return throwError(() => new Error('Refresh token is not available'));
                    })
                );
        }
        else {
            accountService.logout();

            return throwError(() => new Error('Refresh token is not available'));
        }
    }
    else {
        return token$.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => next(addToken(req, token!)))
        );
    }
}

// if (!accountService.token()) {
//     return next(req);
// }

// if (isRefreshing$.value) {
//     return refreshTokenAndProceed(accountService, req, next);
// }

// return next(addToken(req, accountService))
//     .pipe(
//         catchError((httpError: HttpErrorResponse) => {
//             const backendError = httpError.error as BackendError;

//             if (httpError) {
//                 switch (httpError.status) {

//                     case 401: {
//                         return refreshTokenAndProceed(accountService, req, next);
//                     }

//                     default: {
//                         console.log('Unhandled error', httpError);

//                     }
//                 }
//             }
//             throw httpError;
//         })
//     );


// const refreshTokenAndProceed = (
//     accountService: AccountService,
//     req: HttpRequest<any>,
//     next: HttpHandlerFn
// ) => {
//     if (!isRefreshing$.value) {
//         isRefreshing$.next(true);

//         return accountService.refreshToken()
//             .pipe(
//                 switchMap(() => {
//                     return next(addToken(req, accountService))
//                         .pipe(
//                             tap(() => {
//                                 isRefreshing$.next(false);
//                             })
//                         );
//                 })
//             );
//     }

//     if (req.url.includes('refresh')) {
//         debugger
//         return next(addToken(req, accountService));
//     }

//     return isRefreshing$.pipe(
//         filter(isRefreshing => !isRefreshing),
//         switchMap(res => {
//             return next(addToken(req, accountService));
//         })
//     )

// }
