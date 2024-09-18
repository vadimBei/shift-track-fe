import { HttpInterceptorFn } from "@angular/common/http";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const baseUrl = `http://localhost:11000/api/shift-track/`;
    const apiReq = req.clone({
        url: baseUrl + req.url
    });

    return next(apiReq);
}