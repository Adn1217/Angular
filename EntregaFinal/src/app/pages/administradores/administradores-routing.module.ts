import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IngresoComponent } from 'src/app/formulario/ingreso/ingreso.component';
import { AdministradoresComponent } from './administradores.component';
import { DetallesComponent } from './detalles/detalles.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
    {
    path: '',
    component: AdministradoresComponent
    },
    {
    path: 'adminsDetail',
    children: [{
      path: ':id',
      component: DetallesComponent
    }]
    },
    {
      path: '**',
      redirectTo: '/admins' 
    }
  ])
  ],
  exports: [RouterModule]
})
export class AdministradoresRoutingModule { }
