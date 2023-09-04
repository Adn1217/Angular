import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authFeatureKey } from "..";
import { authUserState } from "../reducers/auth.reducer";

export const selectAuthUser = createFeatureSelector<authUserState>(authFeatureKey);
export const selectAuthUserValue = createSelector(selectAuthUser,
    (state) => state.authUser
    );