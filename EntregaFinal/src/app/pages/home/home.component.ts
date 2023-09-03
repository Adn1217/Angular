import { Component } from '@angular/core';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';
import { take, map, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // authUserName: Observable<any> = this.userService.authUser$;
  private authUserName = new BehaviorSubject<any>('');
  public authUserName$ = this.authUserName.asObservable();

  constructor(private userService: IngresoService){
    this.userService.authUser$.pipe(take(1), map( (user) => {
      const nombreCompleto = user.nombres + ' ' + user.apellidos;
      const newUser = {...user, nombreCompleto}
      return newUser
    })).subscribe({
      next: (user) => {
        // console.log('usuario completo: ', user);
        if(user && user.nombres){
          // this.authUserName = user.nombreCompleto;
          this.authUserName.next(user.nombreCompleto)
        }
      }
    })
  }

}
