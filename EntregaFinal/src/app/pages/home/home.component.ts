import { Component } from '@angular/core';
import { IngresoService } from 'src/app/formulario/ingreso/services/ingreso.service';
import { take, map, BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/usuarios/user.service';
import { users } from 'src/app/usuarios/modelos';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // authUserName: Observable<any> = this.userService.authUser$;
  private authUserName = new BehaviorSubject<string>('');
  public authUserName$ = this.authUserName.asObservable();

  constructor(private authService: IngresoService, private userService: UserService ){
    this.authService.authUser$.pipe(take(1), map( (user) => {
      const nombreCompleto = user?.nombres + ' ' + user?.apellidos;
      const newUser = {...user, nombreCompleto}
      return newUser
    })).subscribe({
      next: (user) => {
        // console.log('usuario completo: ', user);
        if(user && user.nombres){
          // this.authUserName = user.nombreCompleto;
          this.authUserName.next(user.nombreCompleto)
        }else{
          const authUser = localStorage.getItem('AuthUser');
          const authUserJSON = authUser && JSON.parse(authUser);
          console.log(authUserJSON.id.toString());
          this.authUserName$ = this.userService.getUserById(authUserJSON.id.toString()).pipe(map( (user) => {
            const nombreCompleto = user?.nombres + ' ' + user?.apellidos
            return nombreCompleto 
          }));
        }
      }
    })
  }

}
