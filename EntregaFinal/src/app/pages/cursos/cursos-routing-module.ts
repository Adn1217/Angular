
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursosComponent } from './cursos.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CursosComponent
      }
    ])
  ],  
  exports: [RouterModule]
})
export class CursosRoutingModule { }
