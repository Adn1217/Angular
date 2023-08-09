import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(IngresoService)
  
  if(authService.isAuthenticated()){
    return true
  }else{
    return router.createUrlTree(['/login']);
  }
};
