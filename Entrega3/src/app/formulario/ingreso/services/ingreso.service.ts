import { Injectable } from '@angular/core';
import { loginUser } from '../models';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/core/services/notifier.service';

@Injectable({
  providedIn: 'root'
})


export class IngresoService {

  private REGISTERED_USERS_DATA = [
    {
      nombre: 'Adrian Fernández',
      email: 'adn1217@hotmail.com',
      password: '12345678'
    },
    {
      nombre: 'Juan Muñoz',
      email: 'j.cr68@hotmail.com',
      password: '12345678'
    },
    {
      nombre: 'Andrea Fernández',
      email: 'afernandez@gmail.com',
      password: '12345678'
    }
  ]

  constructor(private router: Router, private notifier: NotifierService) {
   }
  
  private _authUser$ = new BehaviorSubject<any>(null);
  public authUser$ = this._authUser$.asObservable();

  getRegisterUser(userToLog: loginUser): loginUser | undefined{
    const authUser = this.REGISTERED_USERS_DATA.find((user) => user.email === userToLog.email);
    return authUser
  }

  login(user: loginUser): void{
    const authUser = this.getRegisterUser(user);
    if(authUser && authUser?.password === user.password){
      this.notifier.showSucess('', 'Autenticación exitosa');
      this._authUser$.next(authUser);
      this.router.navigate(['/home'])
    }else{
      this.notifier.showError('Error de autenticación', 'Verifique credenciales');
    }
  }
}
