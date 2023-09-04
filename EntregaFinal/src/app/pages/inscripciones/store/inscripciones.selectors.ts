import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromInscripciones from './inscripciones.reducer';
import { inscripcionesFeatureKey } from "./inscripciones.reducer";

export const selectEnrollmentState = createFeatureSelector<fromInscripciones.enrollmentState>(
  fromInscripciones.inscripcionesFeatureKey
);

export const selectEnrollmentList = createFeatureSelector<fromInscripciones.enrollmentState>(inscripcionesFeatureKey);

export const selectEnrollmentListValue = createSelector(selectEnrollmentList,
    (state) => state.enrollmentList
    );