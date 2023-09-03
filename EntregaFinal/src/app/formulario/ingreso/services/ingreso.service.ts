import { Injectable } from '@angular/core';
import { loginUser } from '../models';
import { BehaviorSubject, skip, take } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { UserService } from 'src/app/usuarios/user.service';

@Injectable({
  providedIn: 'root'
})


export class IngresoService {

  // private REGISTERED_USERS_DATA = [
  //   {
  //     nombre: 'Adrian Fernández',
  //     email: 'adn1217@hotmail.com',
  //     password: '12345678'
  //   },
  //   {
  //     nombre: 'Juan Muñoz',
  //     email: 'j.cr68@hotmail.com',
  //     password: '12345678'
  //   },
  //   {
  //     nombre: 'Andrea Fernández',
  //     email: 'afernandez@gmail.com',
  //     password: '12345678'
  //   }
  // ]

  constructor(private router: Router, private notifier: NotifierService, private userService: UserService) {
   }
  
  private _authUser$ = new BehaviorSubject<any>(null);
  public authUser$ = this._authUser$.asObservable();

  // getRegisterUser(userToLog: loginUser): loginUser | undefined{
  //   const authUser = this.REGISTERED_USERS_DATA.find((user) => user.email === userToLog.email);
  //   return authUser
  // }
  
  isAuthenticated(): boolean {
    let authUser = null;
    this.authUser$.pipe(take(1)).subscribe({
      next: (user) => {
        authUser = user
      }
    })
   
    return (!!authUser)
  }

  login(user: loginUser): void{
    // const authUser = this.getRegisterUser(user);
    const registeredUser = this.userService.getUserByEmail(user.email);
    registeredUser.pipe(skip(1), take(1)).subscribe({
      next: (regUser) => {
        if(regUser && regUser?.password === user.password){
          this.notifier.showSuccess('', 'Autenticación exitosa');
          this._authUser$.next(regUser);
          this.router.navigate(['/home'])
        }else{
          this.notifier.showError('Error de autenticación', 'Verifique credenciales');
        }
      }
    })

  }
}
