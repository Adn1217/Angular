import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullnamePipe } from './pipes/fullname.pipe';

@NgModule({
  declarations: [
    SharedComponent,
    FullnamePipe
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
    MatTooltipModule,
    FullnamePipe
  ]
})
export class SharedModule { }
