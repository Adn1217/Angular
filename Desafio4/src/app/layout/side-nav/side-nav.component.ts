import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  
  // @ViewChild('drawer', { static: true }) 
  // public drawer!: MatDrawer;

  @Input()
  sideBarOpen: boolean = false;

}
