import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosComponent } from './cursos.component';
import { RouterModule } from '@angular/router';
import { CursosRoutingModule } from './cursos-routing-module';



@NgModule({
  declarations: [
    CursosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CursosRoutingModule
  ],
  exports: [CursosComponent]
})
export class CursosModule { }
