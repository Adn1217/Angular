import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers, courses } from 'src/app/usuarios/modelos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        this.client.get<courses[]>(env.baseApiUrl + '/courses').pipe(take(1)).subscribe({
          next: (courses) => {
            this._courses$.next(courses);
            this._isLoading$.next(false);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              if(err.status === 500){
                this._courses$.error(err);
                this.notifier.showError('','Ha ocurrido un error en el servidor');
              }else if(err.status === 404){
                this.notifier.showError('',`Se ha presentado error ${err.status}. No se encuentra el servicio solicitado.`);
              }else{
                this.notifier.showError('',`Se presenta error ${err.status} al consumir el servicio`);
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar cursos.');
            }
          }
        })
      }, 1000);
      return this.courses$;
    }

    getCourseById(id: string): Observable<courses | undefined> {
      this.client.get<courses[]>(env.baseApiUrl + '/courses').pipe(take(1)).subscribe({
        next: (courses) => {
          let course = courses.find((course) => course.id === id);
          this._course$.next(course);
        }
      })
      return this.course$;
    }

    createCourse(course: courses ): void {
      const {id, ...rest} = course;
      this.client.post<courses>(env.baseApiUrl + '/courses', rest)
      .pipe(
        mergeMap((createdCourse) => this.courses$.pipe(
          take(1),
          map((coursesList) => [...coursesList, createdCourse])))
      )
      .subscribe({
        next: (courseList) => {
          this._courses$.next([...courseList]);
        },
        error: (err) => {
          console.log('Ha ocurrido error: ', err);
          if(err instanceof HttpErrorResponse){
            if(err.status === 500){
              this.notifier.showError('',`Se ha presentado error ${err.status}. Error en el servidor. \n ${JSON.stringify(err.error)}`);
            }else if(err.status === 404){
              this.notifier.showError('',`Se ha presentado error ${err.status}. No se encuentra el servicio solicitado. \n ${JSON.stringify(err.error)}`);
            }else{
              this.notifier.showError('',`Se presenta error ${err.status} al consumir el servicio. \n ${JSON.stringify(err.error)}`);
            }
          }else{
            this.notifier.showError('', `Ha ocurrido un error al consultar inscripciones. \n ${JSON.stringify(err.error)}`);
          }
        }
      })
    }

    updateCourse(courseToUpdate: courses): void {
      const {id, ...rest} = courseToUpdate;
      this.client.put<courses>(env.baseApiUrl + `/courses/${id}`, rest).pipe(
        take(1)).subscribe({
          next: (updatedCourse) => {
            if(updatedCourse.id){
              this.getCourses();
            }else{
              this.notifier.showError('','No fue posible actualizar la información');
            }
          },
          error: (error) => {
            this.notifier.showError('', 'Se ha presentado error en el servicio: ' + JSON.stringify(error.error));
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
        }
      });
    }
}
