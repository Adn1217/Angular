import { createFeature, createReducer, on } from '@ngrx/store';
import { InscripcionesActions } from './inscripciones.actions';
import { courses, enrollments, users } from 'src/app/usuarios/modelos';
import { HttpErrorResponse } from '@angular/common/http';

export const inscripcionesFeatureKey = 'enrollments';

export interface enrollmentState {
    enrollmentList: enrollments[],
    usersList: users[],
    coursesList: courses[],
    error: HttpErrorResponse | null
}

export const initialState: enrollmentState = {
    enrollmentList: [],
    usersList: [],
    coursesList: [],
    error: null
}

export const reducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripciones, state => {
    return {
       ...state,
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
  on(InscripcionesActions.loadUsers, state => {
    return {
       ...state,
    }
  }),
  on(InscripcionesActions.loadUsersSuccess, (state, action) => {
    return {
      ...state,
      usersList: action.usersList
    }
  }),
  on(InscripcionesActions.loadUsersFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(InscripcionesActions.loadCourses, state => {
    return {
       ...state,
    }
  }),
  on(InscripcionesActions.loadCoursesSuccess, (state, action) => {
    return {
      ...state,
      coursesList: action.coursesList
    }
  }),
  on(InscripcionesActions.loadCoursesFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(InscripcionesActions.createInscripcion, state => {
    return {
       ...state,
    }
  }),
  on(InscripcionesActions.createInscripcionSuccess, (state, action) => {
    console.log('enrollment en InscripcionSucess', action.enrollment)
    return {
      ...state,
      enrollmentList: [...state.enrollmentList],
      error: null
    }
  }),
  on(InscripcionesActions.createInscripcionFailure, (state, action) => {
    console.log('enrollment en InscripcionFailure', action.error)
    return {
      ...state,
      error: action.error
    }
  }),
  on(InscripcionesActions.updateInscripcion, state => {
    return {
       ...state,
    }
  }),
  on(InscripcionesActions.updateInscripcionSuccess, (state, action) => {
    console.log(action)
    return {
      ...state,
      enrollmentList: [...state.enrollmentList],
      error: null
    }
  }),
  on(InscripcionesActions.updateInscripcionFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(InscripcionesActions.deleteInscripcion, state => {
    return {
       ...state,
    }
  }),
  on(InscripcionesActions.deleteInscripcionSuccess, (state, action) => {
    return {
      ...state,
      enrollmentList: [...state.enrollmentList],
      error: null
    }
  }),
  on(InscripcionesActions.deleteInscripcionFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
);

export const inscripcionesFeature = createFeature({
  name: inscripcionesFeatureKey,
  reducer,
});

