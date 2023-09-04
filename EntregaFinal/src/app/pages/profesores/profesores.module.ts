import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesoresComponent } from './profesores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from 'src/app/usuarios/usuarios.module';
import { DetallesComponent } from './detalles/detalles.component';
import { ProfesoresRoutingModule } from './profesores-routing.module';



@NgModule({
  declarations: [
    ProfesoresComponent,
    DetallesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    UserModule,
    ProfesoresRoutingModule
  ],
  exports: [
    ProfesoresComponent,
    // DetallesComponent
  ]
})
export class ProfesoresModule { }
