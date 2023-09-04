import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DetallesComponent } from './detalles/detalles.component';
import { ProfesoresComponent } from './profesores.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfesoresComponent
      },
      {
        path: 'teacherDetail',
        children: [{
          path: ':id',
          component: DetallesComponent
        }]
      },
      {
        path: '**',
        redirectTo: '/teachers' 
      }
      ]),
  ],
  exports: [RouterModule]
})
export class ProfesoresRoutingModule { }
