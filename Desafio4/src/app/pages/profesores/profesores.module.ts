import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesoresComponent } from './profesores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from 'src/app/usuarios/usuarios.module';



@NgModule({
  declarations: [
    ProfesoresComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    UserModule,
  ],
  exports: [
    ProfesoresComponent
  ]
})
export class ProfesoresModule { }
