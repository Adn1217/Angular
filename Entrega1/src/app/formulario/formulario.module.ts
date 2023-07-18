import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ReactiveFormsModule } from '@angular/forms'
import { UserModule } from '../usuarios/usuarios.module';



@NgModule({
  declarations: [
    RegistroComponent,
    IngresoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserModule
    // FormsModule
  ],
  exports: [
    RegistroComponent,
    IngresoComponent]
})
export class FormularioModule { }
