import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IngresoComponent } from './ingreso.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IngresoComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class IngresoRoutingModule { }
