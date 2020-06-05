import { Reducer } from 'redux';
import { CHANGE_THEME, changeTheme } from './configuration/actions';
import { ThemeName } from './types';

type State = ThemeName;
type Action =
    | ReturnType<typeof changeTheme>
    | { type: 'OTHER_ACTION'; payload?: any };

const themeReducer: Reducer<State, Action> = (
    previousState = 'light',
    action
) => {
    if (action.type === CHANGE_THEME) {
        return action.payload;
    }
    return previousState;
};

export default themeReducer;
