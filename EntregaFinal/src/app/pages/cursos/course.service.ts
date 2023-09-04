import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers, courses } from 'src/app/usuarios/modelos';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { env } from 'src/app/envs/env';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

private  _course$ = new BehaviorSubject<courses | undefined>(undefined);
private course$ = this._course$.asObservable();

private _courses$ = new BehaviorSubject<courses[]>([]);
private courses$ = this._courses$.asObservable();
      
private _isLoading$ = new BehaviorSubject<boolean>(false);
public isLoading$ = this._isLoading$.asObservable();

  constructor(private client: HttpClient, private notifier: NotifierService) {}

    isTeacher(data: users | teachers){
      return ('nivelAcademico' in data)
    }

    getCourses(): Observable<courses[]>{
      this._isLoading$.next(true);
      setTimeout(() => {
        // return this.USERS_DATA;
        this.client.get<courses[]>(env.baseApiUrl + '/courses').pipe(take(1)).subscribe({
          next: (courses) => {
            this._courses$.next(courses);
            this._isLoading$.next(false);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              if(err.status === 500){
                this.notifier.showError('','Ha ocurrido un error en el servidor');
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar cursos.');
            }
          }
        })
      }, 1000);
      // this._users$.next(this.USERS_DATA);
      return this.courses$;
    }

    getCourseById(id: string): Observable<courses | undefined> {
      this.client.get<courses[]>(env.baseApiUrl + '/users').pipe(take(1)).subscribe({
        next: (courses) => {
          console.log('Cursos encontrados: ', JSON.stringify(courses));
          let course = courses.find((course) => course.id === Number(id));
          this._course$.next(course);
        }
      })
      // const user = this.USERS_DATA.find((user) => user.id === Number(id));
      return this.course$;
    }

    createCourse(course: courses ): void {
      this.client.post<courses>(env.baseApiUrl + '/courses', course).pipe(
        mergeMap((createdCourse) => this.courses$.pipe(
          take(1),
          map((coursesList) => [...coursesList, createdCourse])))
      ).subscribe({
        next: (courseList) => {
          this._courses$.next([...courseList]);
        }
      })
    }

    updateUser(courseToUpdate: courses): void {
      console.log('Curso a Actualizar: ', courseToUpdate);
      const {id, ...rest} = courseToUpdate;
      this.client.put<courses>(env.baseApiUrl + `/courses/${id}`, courseToUpdate).pipe(
        take(1)).subscribe({
          next: (updatedCourse) => {
            if(updatedCourse.id){
              this.getCourses();
            }else{
              this.notifier.showError('','No fue posible actualizar la información');
            }
          },
          error: (error) => {
            this.notifier.showError('', 'Se ha presenta error en el servicio: ' + error);
          }
        })
    };
    
    deleteUser(courseToDelete: courses ): void {
      const {id, ...rest} = courseToDelete;
      this.client.delete(env.baseApiUrl + `/courses/${id}`).pipe(take(1)).subscribe({
        next: (response) => {
          this.getCourses();
          this.notifier.showSuccessToast('', 'Se ha eliminado correctamente el curso.', 2000)
        },
        error: (error) => {
          this.notifier.showError('', 'Se ha presentado error al intentar eliminar la información.');
          console.log("Se ha presentado error : ", error)
        }
      });
    }
}
