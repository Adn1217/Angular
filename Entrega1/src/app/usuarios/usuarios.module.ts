import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { SharedModule } from '../shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import { FullnamePipe } from '../shared/pipes/fullname.pipe';


@NgModule({
  declarations: [
    TablaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
  ],
  exports: [
    TablaComponent
  ]
})
export class UserModule { }
