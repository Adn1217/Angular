import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map, skip } from 'rxjs'
import { users, teachers, enrollments, enrollmentsWithCourseAndUser } from 'src/app/usuarios/modelos';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { env } from 'src/app/envs/env';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {

private  _enrollment$ = new BehaviorSubject<enrollments | undefined>(undefined);
private enrollment$ = this._enrollment$.asObservable();

private _enrollments$ = new BehaviorSubject<enrollments[]>([]);
private enrollments$ = this._enrollments$.asObservable();

private _enrollmentsWithCourseAndUsers$ = new BehaviorSubject<enrollmentsWithCourseAndUser[]>([]);
private enrollmentsWithCourseAndUsers$ = this._enrollmentsWithCourseAndUsers$.asObservable();
      
private _isLoading$ = new BehaviorSubject<boolean>(false);
public isLoading$ = this._isLoading$.asObservable();

  constructor(private client: HttpClient, private notifier: NotifierService) {}

    getEnrollments(): Observable<enrollments[]>{
      this._isLoading$.next(true);
        const reqHTTP = this.client.get<enrollments[]>(env.baseApiUrl + '/enrollments')
      return reqHTTP
    }
    
    getEnrollmentsWithCourseAndUser(): Observable<enrollmentsWithCourseAndUser[]>{
      this._isLoading$.next(true);
        // const reqHTTP$ = this.client.get<enrollmentsWithCourseAndUser[]>(env.baseApiUrl + '/enrollments?_expand=user&_expand=course')
        const reqHTTP$ = this.client.get<enrollmentsWithCourseAndUser[]>(env.baseApiUrl + '/enrollments?_expand=true')
      
        reqHTTP$.subscribe({
          next: (enrollments) => {
            this._isLoading$.next(false);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              this._enrollmentsWithCourseAndUsers$.error(err);
              if(err.status === 500){
                this.notifier.showError('',`Se ha presentado error ${err.status}. Error en el servidor.`);
              }else if(err.status === 404){
                this.notifier.showError('',`Se ha presentado error ${err.status}. No se encuentra el servicio solicitado.`);
              }else{
                this.notifier.showError('',`Se presenta error ${err.status} al consumir el servicio`);
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar inscripciones.');
            }
          }
        })
      return reqHTTP$
    }

    getEnrollmentById(id: string): Observable<enrollments | undefined> {
      this.client.get<enrollments[]>(env.baseApiUrl + '/users').pipe(take(1)).subscribe({
        next: (enrollments) => {
          let enrollment = enrollments.find((enrollment) => enrollment.id === id);
          this._enrollment$.next(enrollment);
        }
      })
      return this.enrollment$;
    }

    createEnrollment(enrollment: enrollments ): Observable<enrollments> {

      const {id, ...rest} = enrollment;
      const newEnrollment = rest;
      const reqHTTP1$ = this.client.post<enrollments>(env.baseApiUrl + '/enrollments', newEnrollment, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return reqHTTP1$
    }

    updateEnrollment(enrollmentToUpdate: enrollments ): Observable<enrollments> {
      const {id, ...rest} = enrollmentToUpdate;
      const reqHTTP$ = this.client.put<enrollments>(env.baseApiUrl + `/enrollments/${id}`, rest)
      return reqHTTP$;
    }

    
    deleteEnrollment(enrollmentToDelete: enrollments ): Observable<any> {
      const {id, ...rest} = enrollmentToDelete;
      const reqHTTP$ = this.client.delete(env.baseApiUrl + `/enrollments/${id}`)
      return reqHTTP$
    }
}
