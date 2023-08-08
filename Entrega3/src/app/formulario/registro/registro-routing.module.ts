import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistroComponent } from './registro.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: RegistroComponent
    }])
  ],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
