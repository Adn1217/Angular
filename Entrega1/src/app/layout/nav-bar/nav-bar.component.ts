import { Component, ComponentRef, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input()
  title: string = "";

  @Input()
  sideNav: MatSidenav | null=  null;

  @Input()
  sideBarOpen: boolean = false;

  @Output()
  sideBarOpenChange= new EventEmitter(); 

  changeSideNav(){
    this.sideBarOpen = !this.sideBarOpen;
    this.sideBarOpenChange.emit(this.sideBarOpen);
  }

}
