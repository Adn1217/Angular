import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesComponent } from './inscripciones.component';
import { RouterModule } from '@angular/router';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from 'src/app/usuarios/usuarios.module';
import { EffectsModule } from '@ngrx/effects';
import { InscripcionesEffects } from './store/inscripciones.effects';
import { StoreModule } from '@ngrx/store';
import { inscripcionesFeature } from './store/inscripciones.reducer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FullnamePipe } from 'src/app/shared/pipes/fullname.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InscripcionesComponent,
    // FullnamePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InscripcionesRoutingModule,
    UserModule,
    SharedModule,
    EffectsModule.forFeature([InscripcionesEffects]),
    StoreModule.forFeature(inscripcionesFeature),
    MatFormFieldModule,
    MatSelectModule
  ],
})
export class InscripcionesModule { }
