import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ReactiveFormsModule } from '@angular/forms'
import { UserModule } from '../usuarios/usuarios.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RegistroRoutingModule } from './registro/registro-routing.module';
import { IngresoRoutingModule } from './ingreso/ingreso-routing.module';
import { DetallesComponent } from './registro/detalles/detalles.component';



@NgModule({
  declarations: [
    RegistroComponent,
    IngresoComponent,
    DetallesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    UserModule,
    RegistroRoutingModule,
    IngresoRoutingModule
  ],
  exports: [
    RegistroComponent,
    IngresoComponent]
})
export class FormularioModule { }
