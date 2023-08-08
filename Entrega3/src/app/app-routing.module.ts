import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './formulario/registro/registro.component';
import { IngresoComponent } from './formulario/ingreso/ingreso.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfesoresComponent } from './pages/profesores/profesores.component';
import { DetallesComponent } from './pages/profesores/detalles/detalles.component';

const routes: Routes = [
  { path: 'home',
    component: HomeComponent,
    children: [
      // {
      // path: 'register',
      // component: RegistroComponent
      // },
      {
        path: '**',
        redirectTo: '/home' 
      }
    ]
  },
  {
    path: 'login',
    component: IngresoComponent
  },
  {
    path: 'teachers',
    loadChildren: () => import('./pages/profesores/profesores.module').then((mod) => mod.ProfesoresModule)
  },
  {
    path: 'register',
    component: RegistroComponent
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
