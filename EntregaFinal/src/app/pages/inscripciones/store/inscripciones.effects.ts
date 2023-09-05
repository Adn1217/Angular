import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { InscripcionesActions } from './inscripciones.actions';
import { InscripcionesService } from '../inscripciones.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class InscripcionesEffects {


  loadInscripciones$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscripcionesActions.loadInscripciones),
      concatMap(() => 
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      // EMPTY as Observable<{ type: string }>)
        this.service.getEnrollmentsWithCourseAndUser().pipe(
          map(data => InscripcionesActions.loadInscripcionesSuccess({enrollmentList: data})),
          catchError(error => of(this.handleError(error)))
          // map(data => InscripcionesActions.loadInscripcionesSucess({data})),
        )
      )
    )
  });

  handleError(error: HttpErrorResponse){
    console.log('Se ha presentado el siguente error: ', error);
    return InscripcionesActions.loadInscripcionesFailure({error});
  }
  constructor(private actions$: Actions, private service: InscripcionesService) {

  }
}
