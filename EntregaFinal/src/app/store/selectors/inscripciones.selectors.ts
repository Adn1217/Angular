import { createFeatureSelector, createSelector } from "@ngrx/store";
import { enrollmentState } from "../reducers/inscripciones.reducer";
import { inscripcionesFeatureKey } from "..";

export const selectEnrollmentList = createFeatureSelector<enrollmentState>(inscripcionesFeatureKey);
export const selectEnrollmentListValue = createSelector(selectEnrollmentList,
    (state) => state.enrollmentList
    );