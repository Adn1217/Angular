import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { loginUser } from 'src/app/formulario/ingreso/models';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input()
  title: string = "";

  authUser: Observable<loginUser | null | undefined>;
  authUserEmail: string = ""

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

  constructor(private userService: IngresoService){
    this.authUser = this.userService.authUser$;
    this.userService.authUser$.subscribe(user => {
      if(user && user.email){
        this.authUserEmail = user.email
      }
    })
  }

}
