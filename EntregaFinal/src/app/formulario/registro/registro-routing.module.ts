import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistroComponent } from './registro.component';
import { DetallesComponent } from './detalles/detalles.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: RegistroComponent
    },
    {
      path: 'registerDetail',
      children: [{
        path: ':id',
        component: DetallesComponent
      }]
    },
    {
      path: '**',
      redirectTo: '/register' 
    }
  ])
  ],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
