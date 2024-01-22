import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map, repeat, take, skip } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { InscripcionesActions } from './inscripciones.actions';
import { InscripcionesService } from '../inscripciones.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/usuarios/user.service';
import { CourseService } from '../../cursos/course.service';
import { Store } from '@ngrx/store';
import { NotifierService } from 'src/app/core/services/notifier.service';

@Injectable()
export class InscripcionesEffects {

  constructor(private actions$: Actions, private service: InscripcionesService, private userService: UserService, private courseService: CourseService, private store: Store, private notifier: NotifierService) {

  }

  loadInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.loadInscripciones),
      concatMap(() => 
        this.service.getEnrollmentsWithCourseAndUser().pipe(
          map(data => InscripcionesActions.loadInscripcionesSuccess({enrollmentList: data})),
          catchError(error => of(this.handleError(error, 'loadInscripcionesFailure')))
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
          map(data => InscripcionesActions.createInscripcionSuccess({enrollment: data})
          ),
          catchError(error =>  
            of(this.handleError(error, "createInscripcionesFailure"))
            // of(InscripcionesActions.createInscripcionFailure({error}))
          ),
        )
      )
    )
  });
  
  createInscripcionesSucess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.createInscripcionSuccess),
      map(() => {
        this.store.dispatch(InscripcionesActions.loadInscripciones())
        this.notifier.showSuccess('', 'Se ha creado la inscrpción exitosamente.')
      })
    );
  }, {dispatch: false});
  
  updateInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.updateInscripcion),
      concatMap(({enrollment}) => 
        this.service.updateEnrollment(enrollment).pipe(
          map(data => InscripcionesActions.updateInscripcionSuccess({enrollment: data})),
          catchError(error => of(InscripcionesActions.updateInscripcionFailure({error})))
        )
      )
    )
  });
  
  updateInscripcionesSucess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.updateInscripcionSuccess),
      map(() => this.store.dispatch(InscripcionesActions.loadInscripciones()))
    );
  }, {dispatch: false});
  
  deleteInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.deleteInscripcion),
      concatMap(({enrollment}) => 
        this.service.deleteEnrollment(enrollment).pipe(
          map(data => InscripcionesActions.deleteInscripcionSuccess({enrollment: data})),
          catchError(error => of(InscripcionesActions.deleteInscripcionFailure({error}))),
        )
      )
    )
  });
  
  deleteInscripcionesSucess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.deleteInscripcionSuccess),
      map(() => this.store.dispatch(InscripcionesActions.loadInscripciones()))
    );
  }, {dispatch: false});

  handleError(error: HttpErrorResponse, type: string){ // TODO: Enhance.
    console.log('Se ha presentado el siguente error: ', error);
    switch (type){
      case "loadloadInscripcionesFailure": {
        this.notifier.showError('', `Ha ocurrido un error al consultar las inscripciones ${JSON.stringify(error.message)} \n ${JSON.stringify(error.error)}`)
        return InscripcionesActions.loadInscripcionesFailure({error});
      }
      case "createInscripcionesFailure": {
        this.notifier.showError('', `Ha ocurrido un error guardar la inscripción ${JSON.stringify(error.message)} \n ${JSON.stringify(error.error)}`)
        return InscripcionesActions.createInscripcionFailure({error})
      }
      default: {
        return InscripcionesActions.loadInscripcionesFailure({error});
      } 
    }

      

  }
}
