import { Reducer } from 'redux';
import { CHANGE_THEME, changeTheme } from './configuration/actions';
import { ThemeName } from './types';

type State = ThemeName;
type Action = ReturnType<typeof changeTheme>;

const themeReducer: Reducer<State, Action> = (
    previousState = 'light',
    { type, payload }
) => {
    if (type === CHANGE_THEME) {
        return payload;
    }
    return previousState;
};

export default themeReducer;
