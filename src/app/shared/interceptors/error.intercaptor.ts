import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AccountService } from "../../core/account/services/account.service";
import { catchError } from "rxjs";
import { BackendError } from "../models/errors/backend-error";

export const errorIntercaptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const accountService = inject(AccountService);

    return next(req)
        .pipe(
            catchError((httpError: HttpErrorResponse) => {
                const backendError = httpError.error as BackendError;

                if (httpError) {
                    switch (httpError.status) {

                        default: {
                            console.log('Unhandled error', httpError);

                        }
                    }
                }
                throw httpError;
            })
        );
}


