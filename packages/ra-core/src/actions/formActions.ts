export const INITIALIZE_FORM = 'RA/INITIALIZE_FORM';

export interface InitializeFormAction {
    readonly type: typeof INITIALIZE_FORM;
    readonly payload: any;
}

export const initializeForm = (initialValues: any): InitializeFormAction => ({
    type: INITIALIZE_FORM,
    payload: initialValues,
});

export const RESET_FORM = 'RA/RESET_FORM';

export interface ResetFormAction {
    readonly type: typeof RESET_FORM;
}

export const resetForm = (): ResetFormAction => ({ type: RESET_FORM });

export const BEFORE_LOCATION_CHANGE = 'RA/BEFORE_LOCATION_CHANGE';

export interface BeforeLocationChangeAction {
    readonly type: typeof BEFORE_LOCATION_CHANGE;
    readonly payload: any;
    readonly meta: any;
}
export const beforeLocationChange = ({
    payload,
    meta,
}: {
    payload: any;
    meta: any;
}): BeforeLocationChangeAction => ({
    type: BEFORE_LOCATION_CHANGE,
    payload,
    meta,
});
