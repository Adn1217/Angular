import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SharedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class SharedModule { }
