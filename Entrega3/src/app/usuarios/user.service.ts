import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers } from './modelos';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private USERS_DATA: users[] = [
  {id: 1, nombres: 'Adrian Alberto', apellidos: "Fernández Cabrera", usuario: "adn1217", edad: 32, correo: "adn1217@hotmail.com", password: "12345678"},
  {id: 2, nombres: 'Alejandra Paola', apellidos: "Fernández Castro", usuario: "alu2110", edad: 31, correo: "alufndz_@gmail.com", password: "12345678"},
  {id: 3, nombres: 'Rupertico Adolfo', apellidos: "Herrera Gonzalez", usuario: "ruper12", edad: 32, correo: "raherreraG@gmail.com", password: "12345678"},
];

private TEACHERS_DATA: teachers[] = [
  {id: 1, nombres: 'Sebastián Andrés', apellidos: "Castañeda Rosales", usuario: "scastaneda", edad: 58, nivelAcademico: 'Maestría', materias: ['Cálculo I', 'Cálculo II', 'Cálculo III'], correo: "scastaneda@hotmail.com", password: "12345678"},
  {id: 2, nombres: 'Eric Danilo', apellidos: "Vallejo Fontanarrosa", usuario: "alu2110", edad: 47, nivelAcademico: 'Doctorado', materias: ['Máquinas Eléctricas I', 'Máquinas Eléctricas II'], correo: "evftrsa_@gmail.com", password: "12345678"},
  {id: 3, nombres: 'Libardo Antonio', apellidos: "Ruz Ruiz", usuario: "libardoRuzRuiz", edad: 60, nivelAcademico: 'Especialización', materias: ['Algebra'], correo: "lrruiz@gmail.com", password: "12345678"},
];

private _users$ = new BehaviorSubject<users[]>([]);
private users$ = this._users$.asObservable();

private _teachers$ = new BehaviorSubject<teachers[]>([]);
private teachers$ = this._teachers$.asObservable();

  constructor(private client: HttpClient) {}

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
      this._teachers$.next(this.TEACHERS_DATA);
      return this.teachers$;
    }

    getTeacherById(id: string): Observable<teachers | undefined> {
      let _teacher$ = new BehaviorSubject<teachers | undefined>(undefined);
      let teacher$ = _teacher$.asObservable()
      this.client.get<teachers[]>('http://localhost:3000/teachers').pipe(take(1)).subscribe({
        next: (teachers) => {
          let teacher = teachers.find((teacher) => teacher.id === Number(id));
          _teacher$.next(teacher);
          console.log('Profesor: ', teacher);
        }
      })
      // const teacher = this.TEACHERS_DATA.find((teacher) => teacher.id === Number(id));
      return teacher$;
    }
    
    getUserById(id: string): users | undefined {
      const user = this.USERS_DATA.find((user) => user.id === Number(id));
      return user;
    }

    createUser(user: users | teachers): void {
      if('nivelAcademico' in user){
        this.client.post<teachers>('http://localhost:3000/users', user).pipe(
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
        // this.USERS_DATA = [...this.USERS_DATA, user];
        // this._users$.next(this.USERS_DATA);
      }
    }

    updateUser(userToUpdate: users | teachers): void {
      const {id, ...rest} = userToUpdate;
      if(this.isTeacher(userToUpdate)){
      const NEW_USER_DATA = this.TEACHERS_DATA.map((user) => {
        if(user.id === id){
          return {...user, ...rest};
        }else{
          return user;
        }
      })
      // console.log(NEW_USER_DATA)
        this.TEACHERS_DATA = NEW_USER_DATA;
        this._teachers$.next(NEW_USER_DATA)
      }else{
        const NEW_USER_DATA = this.USERS_DATA.map((user) => {
          if(user.id === id){
            return {...user, ...rest};
          }else{
            return user;
          }
        })
        this.USERS_DATA = NEW_USER_DATA;
        this._users$.next(NEW_USER_DATA)
      }
    }

    deleteUser(userToDelete: users | teachers ): void {
      if(this.isTeacher(userToDelete)){
        this.TEACHERS_DATA = this.TEACHERS_DATA.filter((user) => user.id !== userToDelete.id);
        this._teachers$.next(this.TEACHERS_DATA);
      }else{
        this.USERS_DATA = this.USERS_DATA.filter((user) => user.id !== userToDelete.id);
        this._users$.next(this.USERS_DATA);
      }
    }
}
