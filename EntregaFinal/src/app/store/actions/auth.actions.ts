import { createActionGroup, props } from "@ngrx/store";
import { enrollments, users } from "src/app/usuarios/modelos";


export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        'setAuthUser': props<{authUser: users}>()
    }
})