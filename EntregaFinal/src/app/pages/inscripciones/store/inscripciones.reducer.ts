import { createFeature, createReducer, on } from '@ngrx/store';
import { InscripcionesActions } from './inscripciones.actions';
import { enrollments } from 'src/app/usuarios/modelos';
import { HttpErrorResponse } from '@angular/common/http';

export const inscripcionesFeatureKey = 'enrollments';

export interface enrollmentState {
    enrollmentList: enrollments[],
    error: HttpErrorResponse | null
}

export const initialState: enrollmentState = {
    enrollmentList: [],
    error: null
}

export const reducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripciones, state => {
    return {
       ...state,
      //  enrollmentList: [] 
    }
  }),
  on(InscripcionesActions.loadInscripcionesSuccess, (state, action) => {
    return {
      ...state,
      enrollmentList: action.enrollmentList
    }
  }),
  on(InscripcionesActions.loadInscripcionesFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(InscripcionesActions.delete, (currentState) => {
        
        return {
            // enrollmentList: [...currentState.enrollmentList, Math.round(Number(Math.random())*100)]
            ...currentState,
            enrollmentList: [...currentState.enrollmentList]
        }
    })

);

export const inscripcionesFeature = createFeature({
  name: inscripcionesFeatureKey,
  reducer,
});

