import { createFeature, createReducer, on } from '@ngrx/store';
import { InscripcionesActions } from './inscripciones.actions';
import { enrollments } from 'src/app/usuarios/modelos';

export const inscripcionesFeatureKey = 'enrollments';

export interface enrollmentState {
    enrollmentList: enrollments[]
}

export const initialState: enrollmentState = {
    enrollmentList: []
}

export const reducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripciones, state => {
    return {
       enrollmentList: [] 
    }
  }
  ),
  on(InscripcionesActions.loadInscripcionesSuccess, (state, action) => {
    return {
      enrollmentList: action.enrollmentList
    }
  }
  ),
  on(InscripcionesActions.loadInscripcionesFailure, (state, action) => {
    return state
  }
  ),
  on(InscripcionesActions.delete, (currentState) => {
        
        return {
            // enrollmentList: [...currentState.enrollmentList, Math.round(Number(Math.random())*100)]
            enrollmentList: [...currentState.enrollmentList]
        }
    })

);

export const inscripcionesFeature = createFeature({
  name: inscripcionesFeatureKey,
  reducer,
});

