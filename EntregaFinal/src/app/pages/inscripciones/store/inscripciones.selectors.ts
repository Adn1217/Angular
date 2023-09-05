import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromInscripciones from './inscripciones.reducer';
import { inscripcionesFeatureKey } from "./inscripciones.reducer";

export const selectEnrollmentState = createFeatureSelector<fromInscripciones.enrollmentState>(
  fromInscripciones.inscripcionesFeatureKey
);

export const selectEnrollmentListValue = createSelector(selectEnrollmentState,
    (state) => state.enrollmentList
    );

export const selectUsersListValue = createSelector(selectEnrollmentState,
    (state) => state.usersList
    );

export const selectCoursesListValue = createSelector(selectEnrollmentState,
    (state) => state.coursesList
    );