import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ReactiveFormsModule } from '@angular/forms'
import { UserModule } from '../usuarios/usuarios.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RegistroComponent,
    IngresoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    RegistroComponent,
    IngresoComponent]
})
export class FormularioModule { }
