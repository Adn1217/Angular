import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradoresRoutingModule } from './administradores-routing.module';
import { AdministradoresComponent } from './administradores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from 'src/app/usuarios/usuarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetallesComponent } from './detalles/detalles.component';



@NgModule({
  declarations: [
    AdministradoresComponent,
    DetallesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UserModule,
    AdministradoresRoutingModule
  ]
})
export class AdministradoresModule { }
