import { Injectable } from '@angular/core';
import { loginUser } from '../models';
import { BehaviorSubject, skip, take } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { UserService } from 'src/app/usuarios/user.service';
import { authActions } from 'src/app/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})


export class IngresoService {

  constructor(private router: Router, private notifier: NotifierService, private userService: UserService, private store: Store) {
   }
  
  private _authUser$ = new BehaviorSubject<any>(null);
  public authUser$ = this._authUser$.asObservable();

  // isAuthenticated(): boolean {
  //   let authUser = null;
  //   this.authUser$.pipe(take(1)).subscribe({
  //     next: (user) => {
  //       authUser = user
  //     }
  //   })
  //   console.log('Is authenticated: ', !!authUser)
  //   return (!!authUser)
  // }

  isAuthenticated(): boolean {
    let authUser = null;
    let authUser$ = this.store.select(selectAuthUserValue);
    authUser$.pipe(take(1)).subscribe({
      next: (user) => {
        authUser = user
        // console.log('Usuario autenticado: ', user)
      }
    })
    return (!!authUser)
  }

  login(user: loginUser): void{
    const registeredUser = this.userService.getUserByEmail(user.email);
    registeredUser.pipe(skip(1), take(1)).subscribe({
      next: (regUser) => {
        if(regUser && regUser?.password === user.password){
          const {id, role} = regUser;
          this.notifier.showSuccess('', 'Autenticación exitosa');
          localStorage.setItem('AuthUser', JSON.stringify({id, role}));
          this.store.dispatch(authActions.setAuthUser({authUser: regUser}))
          this._authUser$.next(regUser);
          this.router.navigate(['/home'])
        }else{
          this._authUser$.next(null);
          localStorage.removeItem('AuthUser');
          this.notifier.showError('Error de autenticación', 'Verifique credenciales');
        }
      }
    })

  }
}
