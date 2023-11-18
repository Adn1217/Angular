import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradoresRoutingModule } from './administradores-routing.module';
import { AdministradoresComponent } from './administradores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from 'src/app/usuarios/usuarios.module';



@NgModule({
  declarations: [
    AdministradoresComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    AdministradoresRoutingModule
  ]
})
export class AdministradoresModule { }
