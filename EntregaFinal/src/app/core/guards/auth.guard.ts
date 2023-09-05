import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(IngresoService);
  const authUser = localStorage.getItem('AuthUser');
  if(authService.isAuthenticated() || authUser ){
    return true
  }else{
    return router.createUrlTree(['/login']);
  }
};

export const authAdminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  // const authService = inject(IngresoService);
  const authUser = localStorage.getItem('AuthUser');
  if(authUser && JSON.parse(authUser).role === 'admin'){
    return true
  }else{
    return router.createUrlTree(['/login']);
  }
};

