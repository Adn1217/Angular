import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { enrollments, enrollmentsWithCourseAndUser } from "src/app/usuarios/modelos";

export const InscripcionesActions = createActionGroup({
  source: 'Inscripciones',
  events: {
    'Load Inscripciones': emptyProps(),
    'Load Inscripciones Success': props<{enrollmentList: enrollmentsWithCourseAndUser[]}>(),
    'Load Inscripciones Failure': props<{error: HttpErrorResponse}>(),
    'delete': props<{enrollmentToDelete: enrollments}>()
  }
});
