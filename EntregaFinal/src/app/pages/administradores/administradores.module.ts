import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradoresRoutingModule } from './administradores-routing.module';
import { AdministradoresComponent } from './administradores.component';



@NgModule({
  declarations: [
    AdministradoresComponent
  ],
  imports: [
    CommonModule,
    AdministradoresRoutingModule
  ]
})
export class AdministradoresModule { }
