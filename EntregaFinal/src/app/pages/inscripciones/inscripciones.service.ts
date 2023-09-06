import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
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
      setTimeout(() => {
        this.client.get<enrollments[]>(env.baseApiUrl + '/enrollments').subscribe({
          next: (enrollments) => {
            this._enrollments$.next(enrollments);
            this._isLoading$.next(false);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              this._enrollments$.error(err);
              if(err.status === 500){
                this.notifier.showError('','Ha ocurrido un error en el servidor');
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar inscripciones.');
            }
          }
        })
      }, 1000);
      return this.enrollments$;
    }
    
    getEnrollmentsWithCourseAndUser(): Observable<enrollmentsWithCourseAndUser[]>{
      this._isLoading$.next(true);
      setTimeout(() => {
        const reqHTTP$ = this.client.get<enrollmentsWithCourseAndUser[]>(env.baseApiUrl + '/enrollments?_expand=user&_expand=course').pipe(take(1))
        
        reqHTTP$.subscribe({
          next: (enrollments) => {
            this._enrollmentsWithCourseAndUsers$.next(enrollments);
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
      }, 1000);
      return this.enrollmentsWithCourseAndUsers$;
    }

    getEnrollmentById(id: string): Observable<enrollments | undefined> {
      this.client.get<enrollments[]>(env.baseApiUrl + '/users').pipe(take(1)).subscribe({
        next: (enrollments) => {
          let enrollment = enrollments.find((enrollment) => enrollment.id === Number(id));
          this._enrollment$.next(enrollment);
        }
      })
      return this.enrollment$;
    }

    createEnrollment(enrollment: enrollments ): Observable<enrollments> {
      console.log('Body', enrollment);
      const reqHTTP$ = this.client.post<enrollments>(env.baseApiUrl + '/enrollments', enrollment)
      reqHTTP$.pipe(
        // mergeMap((createdEnrollment) => this.enrollments$.pipe(
        // take(1),
        // map((enrollmentList) => [...enrollmentList, createdEnrollment])))
      )
      .subscribe({
        next: () => {
          this.getEnrollmentsWithCourseAndUser().pipe(take(1)).subscribe({
            next: (enrollmentList) => {
              this._enrollmentsWithCourseAndUsers$.next([...enrollmentList]);
            }
          })
        },
        error: (err) => {
          console.log('Ha ocurrido error: ', err);
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

    updateEnrollment(enrollmentToUpdate: enrollments ): Observable<enrollments> {
      const {id, ...rest} = enrollmentToUpdate;
      const reqHTTP$ = this.client.put<enrollments>(env.baseApiUrl + `/enrollments/${id}`, enrollmentToUpdate)
      reqHTTP$.pipe(take(1)).subscribe({
        next: (newEnrollment) => {
          this.getEnrollmentsWithCourseAndUser().pipe(take(1)).subscribe({
            next: (enrollmentList) => {
              this._enrollmentsWithCourseAndUsers$.next([...enrollmentList]);
            }
          })
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
      return reqHTTP$;
    }

    
    deleteEnrollment(enrollmentToDelete: enrollments ): Observable<any> {
      const {id, ...rest} = enrollmentToDelete;
      const reqHTTP$ = this.client.delete(env.baseApiUrl + `/enrollments/${id}`)
      reqHTTP$.subscribe({
        next: (response) => {
          this.getEnrollmentsWithCourseAndUser().pipe(take(1)).subscribe({
            next: (enrollmentList) => {
              this._enrollmentsWithCourseAndUsers$.next([...enrollmentList]);
            }
          })
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
}
