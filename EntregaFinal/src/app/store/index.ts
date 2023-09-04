import { ActionReducerMap } from "@ngrx/store";
import { enrollmentState, inscripcionesReducer } from "./reducers/inscripciones.reducer";
import { authReducer, authUserState } from "./reducers/auth.reducer";

export const inscripcionesFeatureKey = 'enrollment'
export const authFeatureKey = 'auth'

export interface appReducer {
    // [inscripcionesFeatureKey]: enrollmentState,
    [authFeatureKey]: authUserState
}

export const appReducer: ActionReducerMap<appReducer> = {
    // [inscripcionesFeatureKey]: inscripcionesReducer,
    [authFeatureKey]: authReducer
}