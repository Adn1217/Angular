import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map, repeat } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { InscripcionesActions } from './inscripciones.actions';
import { InscripcionesService } from '../inscripciones.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/usuarios/user.service';
import { CourseService } from '../../cursos/course.service';

@Injectable()
export class InscripcionesEffects {


  loadInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.loadInscripciones),
      concatMap(() => 
        this.service.getEnrollmentsWithCourseAndUser().pipe(
          map(data => InscripcionesActions.loadInscripcionesSuccess({enrollmentList: data})),
          catchError(error => of(this.handleError(error)))
        )
      )
    )
  });
  
  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.loadUsers),
      concatMap(() => 
        this.userService.getUsers().pipe(
          map(data => InscripcionesActions.loadUsersSuccess({usersList: data})),
          catchError(error => of(InscripcionesActions.loadUsersFailure({error})))
        )
      )
    )
  });
  
  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.loadCourses),
      concatMap(() => 
        this.courseService.getCourses().pipe(
          map(data => InscripcionesActions.loadCoursesSuccess({coursesList: data})),
          catchError(error => of(InscripcionesActions.loadCoursesFailure({error})))
        )
      )
    )
  });
  
  createInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.createInscripcion),
      concatMap(({enrollment}) => 
        this.service.createEnrollment(enrollment).pipe(
          map(data => InscripcionesActions.createInscripcionSuccess({enrollmentList: data})),
          catchError(error => of(InscripcionesActions.createInscripcionFailure({error})))
        )
      )
    )
  });
  
  updateInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.updateInscripcion),
      concatMap(({enrollment}) => 
        this.service.updateEnrollment(enrollment).pipe(
          map(data => InscripcionesActions.updateInscripcionSuccess({enrollmentList: data})),
          catchError(error => of(InscripcionesActions.updateInscripcionFailure({error})))
        )
      )
    )
  });
  
  deleteInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.deleteInscripcion),
      concatMap(({enrollment}) => 
        this.service.deleteEnrollment(enrollment).pipe(
          map(data => InscripcionesActions.deleteInscripcionSuccess({enrollmentList: data})),
          catchError(error => of(InscripcionesActions.deleteInscripcionFailure({error}))),
        )
      )
    )
  });

  handleError(error: HttpErrorResponse){
    console.log('Se ha presentado el siguente error: ', error);
    return InscripcionesActions.loadInscripcionesFailure({error});
  }
  constructor(private actions$: Actions, private service: InscripcionesService, private userService: UserService, private courseService: CourseService) {

  }
}
