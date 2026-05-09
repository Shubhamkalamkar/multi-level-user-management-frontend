import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Always attach credentials (cookies) to outgoing requests
  const modifiedReq = req.clone({
    withCredentials: true
  });
  return next(modifiedReq);
};
