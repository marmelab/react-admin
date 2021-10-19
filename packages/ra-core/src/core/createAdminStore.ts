import { createStore, StoreEnhancer } from 'redux';
import { History } from 'history';

import {
    AuthProvider,
    DataProvider,
    I18nProvider,
    InitialState,
} from '../types';
import createAppReducer from '../reducer';
import { CLEAR_STATE } from '../actions/clearActions';

interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: (traceOptions: object) => StoreEnhancer;
}

interface Params {
    dataProvider: DataProvider;
    history: History;
    authProvider?: AuthProvider;
    customReducers?: any;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    locale?: string;
}

export default ({
    dataProvider,
    history,
    customReducers = {},
    authProvider = null,
    initialState,
}: Params) => {
    const appReducer = createAppReducer(customReducers, history);

    const resettableAppReducer = (state, action) =>
        appReducer(
            action.type !== CLEAR_STATE
                ? state
                : // Erase data from the store but keep location, notifications, ui prefs, etc.
                  // This allows e.g. to display a notification on logout
                  {
                      ...state,
                      admin: {
                          ...state.admin,
                          loading: 0,
                          resources: {},
                          customQueries: {},
                          references: { oneToMany: {}, possibleValues: {} },
                      },
                  },
            action
        );
    const typedWindow = typeof window !== 'undefined' && (window as Window);

    const store = createStore(
        resettableAppReducer,
        typeof initialState === 'function' ? initialState() : initialState,
        typedWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
            typedWindow.__REDUX_DEVTOOLS_EXTENSION__({
                trace: true,
                traceLimit: 25,
            })
    );
    return store;
};
