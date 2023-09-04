import { createReducer, on } from "@ngrx/store";
import { inscripcionesActions } from "../actions/inscripciones.actions";

export interface enrollmentState {
    enrollmentList: Number[]
}

const initialState: enrollmentState = {
    enrollmentList: [] 
}

export const inscripcionesReducer = createReducer(
    initialState,
    on(inscripcionesActions.delete, (currentState) => {
        
        return {
            enrollmentList: [...currentState.enrollmentList, Math.round(Number(Math.random())*100)]
        }
    })
    )