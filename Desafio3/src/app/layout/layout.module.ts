import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';



@NgModule({
  declarations: [
    NavBarComponent,
    MainWrapperComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NavBarComponent,
    MainWrapperComponent
  ]
})
export class LayoutModule { }
