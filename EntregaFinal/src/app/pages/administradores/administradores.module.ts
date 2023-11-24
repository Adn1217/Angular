import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradoresRoutingModule } from './administradores-routing.module';
import { AdministradoresComponent } from './administradores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from 'src/app/usuarios/usuarios.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetallesComponent } from './detalles/detalles.component';
import {MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';


@NgModule({
  declarations: [
    AdministradoresComponent,
    DetallesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatRadioModule,
    ReactiveFormsModule,
    UserModule,
    AdministradoresRoutingModule
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }]
})
export class AdministradoresModule { }
