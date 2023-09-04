import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InscripcionesComponent } from './inscripciones.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InscripcionesComponent
      },
      ]),
  ],
  exports: [RouterModule]
})
export class InscripcionesRoutingModule { }
