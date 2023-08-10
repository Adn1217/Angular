import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers } from './modelos';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'src/app/core/services/notifier.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private _users$ = new BehaviorSubject<users[]>([]);
private users$ = this._users$.asObservable();

private _teachers$ = new BehaviorSubject<teachers[]>([]);
private teachers$ = this._teachers$.asObservable();

  constructor(private client: HttpClient, private notifier: NotifierService) {}

    isTeacher(data: users | teachers){
      return ('nivelAcademico' in data)
    }

    getUsers(): Observable<users[]>{
      // return this.USERS_DATA;
      this.client.get<users[]>('http://localhost:3000/users').pipe(take(1)).subscribe({
        next: (users) => {
        this._users$.next(users);
        }
      })
      // this._users$.next(this.USERS_DATA);
      return this.users$;
    }

    getTeachers(): Observable<teachers[]>{
      this.client.get<teachers[]>('http://localhost:3000/teachers').pipe(take(1)).subscribe({
        next: (teachers) => {
        this._teachers$.next(teachers);
        }
      })
      // this._teachers$.next(this.TEACHERS_DATA);
      return this.teachers$;
    }

    getTeacherById(id: string): Observable<teachers | undefined> {
      let _teacher$ = new BehaviorSubject<teachers | undefined>(undefined);
      let teacher$ = _teacher$.asObservable();
      this.client.get<teachers>(`http://localhost:3000/teachers/${id}`).pipe(take(1)).subscribe({
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
      this.client.get<users[]>('http://localhost:3000/users').pipe(take(1)).subscribe({
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
        this.client.post<teachers>('http://localhost:3000/teachers', user).pipe(
          mergeMap((createdTeacher) => this.teachers$.pipe(
            take(1),
            map((teachersList) => [...teachersList, createdTeacher])))
        ).subscribe({
          next: (teacherList) => {
            this._teachers$.next([...teacherList]);
          }
        })
      }else{
        this.client.post<users>('http://localhost:3000/users', user).pipe(
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
        this.client.put<teachers>(`http://localhost:3000/teachers/${id}`, userToUpdate).pipe(
          take(1)).subscribe({
            next: (updatedTeacher) => {
              if(updatedTeacher.id){
                this.getTeachers();
              }else{
                this.notifier.showError('','No fue posible actualizar la información');
              }
            }
          })
      }else{
        this.client.put<users>(`http://localhost:3000/users/${id}`, userToUpdate).pipe(
          take(1)).subscribe({
            next: (updatedUser) => {
              if(updatedUser.id){
                this.getUsers();
              }else{
                this.notifier.showError('','No fue posible actualizar la información');
              }
            }
          })
      }
    };
    
    deleteUser(userToDelete: users | teachers ): void {
      const {id, ...rest} = userToDelete;
      if(this.isTeacher(userToDelete)){
        this.client.delete(`http://localhost:3000/teachers/${id}`).pipe(take(1)).subscribe({
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
        this.client.delete<users>(`http://localhost:3000/users/${id}`).pipe(take(1)).subscribe({
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
