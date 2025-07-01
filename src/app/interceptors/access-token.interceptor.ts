import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Asegurarse de que no haya comillas extrañas
  const cleanToken = token?.replace(/"/g, "");

  // Evitar incluir el token en rutas como auth/login o auth/signup
  if (cleanToken && !req.url.includes("auth")) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
