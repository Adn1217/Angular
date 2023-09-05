import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { courses, enrollments, enrollmentsWithCourseAndUser, users } from "src/app/usuarios/modelos";

export const InscripcionesActions = createActionGroup({
  source: 'Inscripciones',
  events: {
    'Load Inscripciones': emptyProps(),
    'Load Inscripciones Success': props<{enrollmentList: enrollmentsWithCourseAndUser[]}>(),
    'Load Inscripciones Failure': props<{error: HttpErrorResponse}>(),
    'Load Users': emptyProps(),
    'Load Users Success': props<{usersList: users[]}>(),
    'Load Users Failure': props<{error: HttpErrorResponse}>(),
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{coursesList: courses[]}>(),
    'Load Courses Failure': props<{error: HttpErrorResponse}>(),
    'Create Inscripcion': props<{enrollment: enrollments}>(),
    'Create Inscripcion Success': props<{enrollmentList: enrollments[]}>(),
    'Create Inscripcion Failure': props<{error: HttpErrorResponse}>(),
    'delete': props<{enrollmentToDelete: enrollments}>()
  }
});
