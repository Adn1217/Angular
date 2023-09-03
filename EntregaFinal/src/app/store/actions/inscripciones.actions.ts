import { createActionGroup, props } from "@ngrx/store";
import { enrollments } from "src/app/usuarios/modelos";


export const inscripcionesActions = createActionGroup({
    source: 'Inscripciones',
    events: {
        'delete': props<{enrollmentToDelete: enrollments}>()
    }
})