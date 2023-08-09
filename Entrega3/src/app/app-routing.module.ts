import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then((mod) => mod.HomeModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./formulario/ingreso/ingreso-routing.module').then((mod) => mod.IngresoRoutingModule)
  },
  {
    path: 'teachers',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/profesores/profesores.module').then((mod) => mod.ProfesoresModule)
  },
  {
    path: 'register',
    canActivate: [authGuard],
    loadChildren: () => import('./formulario/registro/registro-routing.module').then((mod) => mod.RegistroRoutingModule)
  },     
  {
    path: '**',
    redirectTo: '/login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
