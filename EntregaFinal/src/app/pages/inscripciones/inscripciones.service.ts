import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, take, mergeMap, map } from 'rxjs'
import { users, teachers, enrollments } from 'src/app/usuarios/modelos';
import { HttpClient } from '@angular/common/http';
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
      
private _isLoading$ = new BehaviorSubject<boolean>(false);
public isLoading$ = this._isLoading$.asObservable();

  constructor(private client: HttpClient, private notifier: NotifierService) {}

    isTeacher(data: users | teachers){
      return ('nivelAcademico' in data)
    }

    getEnrollments(): Observable<enrollments[]>{
      this._isLoading$.next(true);
      setTimeout(() => {
        // return this.USERS_DATA;
        this.client.get<enrollments[]>(env.baseApiUrl + '/enrollments').pipe(take(1)).subscribe({
          next: (enrollments) => {
            this._enrollments$.next(enrollments);
            this._isLoading$.next(false);
          },
          error: (err) => {
            if(err instanceof HttpErrorResponse){
              if(err.status === 500){
                this.notifier.showError('','Ha ocurrido un error en el servidor');
              }
            }else{
              this.notifier.showError('', 'Ha ocurrido un error al consultar inscripciones.');
            }
          }
        })
      }, 1000);
      // this._users$.next(this.USERS_DATA);
      return this.enrollments$;
    }

    getEnrollmentById(id: string): Observable<enrollments | undefined> {
      this.client.get<enrollments[]>(env.baseApiUrl + '/users').pipe(take(1)).subscribe({
        next: (enrollments) => {
          console.log('Cursos encontrados: ', JSON.stringify(enrollments));
          let enrollment = enrollments.find((enrollment) => enrollment.id === Number(id));
          this._enrollment$.next(enrollment);
        }
      })
      // const user = this.USERS_DATA.find((user) => user.id === Number(id));
      return this.enrollment$;
    }

    createEnrollment(enrollment: enrollments ): void {
      this.client.post<enrollments>(env.baseApiUrl + '/enrollments', enrollment).pipe(
        mergeMap((createdEnrollment) => this.enrollments$.pipe(
          take(1),
          map((enrollmentsList) => [...enrollmentsList, createdEnrollment])))
      ).subscribe({
        next: (enrollmentList) => {
          this._enrollments$.next([...enrollmentList]);
        }
      })
    }

    updateEnrollment(enrollmentToUpdate: enrollments): void {
      console.log('Curso a Actualizar: ', enrollmentToUpdate);
      const {id, ...rest} = enrollmentToUpdate;
      this.client.put<enrollments>(env.baseApiUrl + `/enrollments/${id}`, enrollmentToUpdate).pipe(
        take(1)).subscribe({
          next: (updatedEnrollment) => {
            if(updatedEnrollment.id){
              this.getEnrollments();
            }else{
              this.notifier.showError('','No fue posible actualizar la información');
            }
          },
          error: (error) => {
            this.notifier.showError('', 'Se ha presenta error en el servicio: ' + error);
          }
        })
    };
    
    deleteEnrollment(enrollmentToDelete: enrollments ): void {
      const {id, ...rest} = enrollmentToDelete;
      this.client.delete(env.baseApiUrl + `/enrollments/${id}`).pipe(take(1)).subscribe({
        next: (response) => {
          this.getEnrollments();
          this.notifier.showSuccessToast('', 'Se ha eliminado correctamente la inscripción.', 2000)
        },
        error: (error) => {
          this.notifier.showError('', 'Se ha presentado error al intentar eliminar la información.');
          console.log("Se ha presentado error : ", error)
        }
      });
    }
}
