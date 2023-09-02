import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesComponent } from './inscripciones.component';
import { RouterModule } from '@angular/router';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from 'src/app/usuarios/usuarios.module';



@NgModule({
  declarations: [
    InscripcionesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InscripcionesRoutingModule,
    UserModule
  ],
})
export class InscripcionesModule { }
