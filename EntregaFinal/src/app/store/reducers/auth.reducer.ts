import { createReducer, on } from "@ngrx/store";
import { inscripcionesActions } from "../actions/inscripciones.actions";
import { users } from "src/app/usuarios/modelos";
import { authActions } from "../actions/auth.actions";

export interface authUserState {
    authUser: users | null
}

const initialState: authUserState = {
    authUser: null
}

export const authReducer = createReducer(
    initialState,
    on(authActions.setAuthUser, (currentState, action) => {
        
        return {
            authUser: action.authUser
        }
    }),
    on(authActions.logoutAuthUser, (currentState) => {
        localStorage.removeItem('AuthUser');
        return {
            authUser: null
        }
    })
)