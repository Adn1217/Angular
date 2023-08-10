import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers } from './modelos';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { env } from 'src/app/envs/env';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private _users$ = new BehaviorSubject<users[]>([]);
private users$ = this._users$.asObservable();

private _teachers$ = new BehaviorSubject<teachers[]>([]);
private teachers$ = this._teachers$.asObservable();

private _isLoading$ = new BehaviorSubject<boolean>(false);
public isLoading$ = this._isLoading$.asObservable();

  constructor(private client: HttpClient, private notifier: NotifierService) {}

    isTeacher(data: users | teachers){
      return ('nivelAcademico' in data)
    }

    getUsers(): Observable<users[]>{
      this._isLoading$.next(true);
      setTimeout(() => {
      // return this.USERS_DATA;
      this.client.get<users[]>(env.baseApiUrl+'/users').pipe(take(1)).subscribe({
        next: (users) => {
          this._users$.next(users);
          this._isLoading$.next(false);
        },
        error: (err) => {
          if(err instanceof HttpErrorResponse){
            if(err.status === 500){
              this.notifier.showError('','Ha ocurrido un error en el servidor');
            }
          }else{
            this.notifier.showError('', 'Ha ocurrido un error al consultar usuarios.');
          }
        }
      })
      }, 1000);
      // this._users$.next(this.USERS_DATA);
      return this.users$;
    }

    getTeachers(): Observable<teachers[]>{
      this._isLoading$.next(true);
      setTimeout(() => {
        this.client.get<teachers[]>(env.baseApiUrl + '/teachers').pipe(take(1)).subscribe({
          next: (teachers) => {
            this._teachers$.next(teachers);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              if(err.status === 500){
                this.notifier.showError('','Ha ocurrido un error en el servidor');
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar profesores.');
            }
          },
          complete: () => {
            this._isLoading$.next(false);
          }
        })
      }, 1000);
      // this._teachers$.next(this.TEACHERS_DATA);
      return this.teachers$;
    }

    getTeacherById(id: string): Observable<teachers | undefined> {
      let _teacher$ = new BehaviorSubject<teachers | undefined>(undefined);
      let teacher$ = _teacher$.asObservable();
      this.client.get<teachers>(env.baseApiUrl + `/teachers/${id}`).pipe(take(1)).subscribe({
        next: (teacher) => {
          _teacher$.next(teacher);
        },
        error: (error) => {
          _teacher$.next(undefined);
          console.log("Se presenta el error: ", error)
        }
      })
      return teacher$;
    }
    
    getUserById(id: string): Observable<users | undefined> {
      let _user$ = new BehaviorSubject<users | undefined>(undefined);
      let user$ = _user$.asObservable();
      this.client.get<users[]>(env.baseApiUrl + '/users').pipe(take(1)).subscribe({
        next: (users) => {
          let user = users.find((user) => user.id === Number(id));
          _user$.next(user);
        }
      })
      // const user = this.USERS_DATA.find((user) => user.id === Number(id));
      return user$;
    }

    createUser(user: users | teachers): void {
      if('nivelAcademico' in user){
        this.client.post<teachers>(env.baseApiUrl + '/teachers', user).pipe(
          mergeMap((createdTeacher) => this.teachers$.pipe(
            take(1),
            map((teachersList) => [...teachersList, createdTeacher])))
        ).subscribe({
          next: (teacherList) => {
            this._teachers$.next([...teacherList]);
          }
        })
      }else{
        this.client.post<users>(env.baseApiUrl + '/users', user).pipe(
          mergeMap((createdUser) => this.users$.pipe(
            take(1),
            map((usersList) => [...usersList, createdUser])))
        ).subscribe({
          next: (userList) => {
            this._users$.next([...userList]);
          }
        })
      }
    }

    updateUser(userToUpdate: users | teachers): void {
      const {id, ...rest} = userToUpdate;
      if('nivelAcademico' in userToUpdate){
        this.client.put<teachers>(env.baseApiUrl + `/teachers/${id}`, userToUpdate).pipe(
          take(1)).subscribe({
            next: (updatedTeacher) => {
              if(updatedTeacher.id){
                this.getTeachers();
              }else{
                this.notifier.showError('','No fue posible actualizar la información');
              }
            },
            error: (error) => {
              this.notifier.showError('', 'Se ha presenta error en el servicio: ' + error);
            }
          })
      }else{
        this.client.put<users>(env.baseApiUrl + `/users/${id}`, userToUpdate).pipe(
          take(1)).subscribe({
            next: (updatedUser) => {
              if(updatedUser.id){
                this.getUsers();
              }else{
                this.notifier.showError('','No fue posible actualizar la información');
              }
            },
            error: (error) => {
              this.notifier.showError('', 'Se ha presenta error en el servicio: ' + error);
            }
          })
      }
    };
    
    deleteUser(userToDelete: users | teachers ): void {
      const {id, ...rest} = userToDelete;
      if(this.isTeacher(userToDelete)){
        this.client.delete(env.baseApiUrl + `/teachers/${id}`).pipe(take(1)).subscribe({
          next: (response) => {
            this.getTeachers();
            this.notifier.showSuccessToast('', 'Se ha eliminado correctamente al profesor.', 2000)
          },
          error: (error) => {
            this.notifier.showError('', 'Se ha presentado error al intentar eliminar la información.');
            console.log("Se ha presentado error : ", error)
          }
        });
      }else{
        this.client.delete<users>(env.baseApiUrl + `/users/${id}`).pipe(take(1)).subscribe({
          next: (response) => {
            this.getUsers();
            this.notifier.showSuccessToast('', 'Se ha eliminado correctamente al usuario.', 2000)
            },
          error: (error) => {
            this.notifier.showError('', 'Se ha presentado error al intentar eliminar la información.');
            console.log('Se ha presentado error: ', error);
          }
        })
      }
    }
}
