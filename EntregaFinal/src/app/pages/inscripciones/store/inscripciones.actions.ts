import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { enrollments } from "src/app/usuarios/modelos";

export const InscripcionesActions = createActionGroup({
  source: 'Inscripciones',
  events: {
    'Load Inscripciones': emptyProps(),
    'delete': props<{enrollmentToDelete: enrollments}>()
  }
});
