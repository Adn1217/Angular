import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { ReactiveFormsModule } from '@angular/forms'



@NgModule({
  declarations: [
    RegistroComponent,
    IngresoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // FormsModule
  ],
  exports: [
    RegistroComponent,
    IngresoComponent]
})
export class FormularioModule { }
