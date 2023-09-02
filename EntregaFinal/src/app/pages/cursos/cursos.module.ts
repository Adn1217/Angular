import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosComponent } from './cursos.component';
import { RouterModule } from '@angular/router';
import { CursosRoutingModule } from './cursos-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from 'src/app/usuarios/usuarios.module';



@NgModule({
  declarations: [
    CursosComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    UserModule,
    CursosRoutingModule
  ],
  exports: [CursosComponent]
})
export class CursosModule { }
