import { CHANGE_THEME } from './configuration/actions';

export default (
    previousState = 'light',
    { type, payload }: { type: string; payload: any }
) => {
    if (type === CHANGE_THEME) {
        return payload;
    }
    return previousState;
};
