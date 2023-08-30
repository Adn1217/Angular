import { Component } from '@angular/core';
import { ServicesService } from './services/services.service';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  authUserName: string = '';

  constructor(private homeService: ServicesService, private userService: IngresoService){
    this.userService.authUser$.pipe(take(1)).subscribe((user) => {
      if(user && user.nombre){
        this.authUserName = user.nombre;
      }
    } )
  }

}
