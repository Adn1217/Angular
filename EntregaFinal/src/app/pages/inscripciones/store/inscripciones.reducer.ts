import { createFeature, createReducer, on } from '@ngrx/store';
import { InscripcionesActions } from './inscripciones.actions';

export const inscripcionesFeatureKey = 'enrollments';

export interface enrollmentState {
    enrollmentList: Number[]
}

export const initialState: enrollmentState = {
    enrollmentList: []
}

export const reducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripciones, state => {
    return {
       enrollmentList: [1,2,3,4,5] 
    }
  }
),
  on(InscripcionesActions.delete, (currentState) => {
        
        return {
            enrollmentList: [...currentState.enrollmentList, Math.round(Number(Math.random())*100)]
        }
    })

);

export const inscripcionesFeature = createFeature({
  name: inscripcionesFeatureKey,
  reducer,
});

