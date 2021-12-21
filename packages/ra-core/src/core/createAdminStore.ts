import { createStore, StoreEnhancer } from 'redux';

import { InitialState } from '../types';
import createAppReducer from '../reducer';
import { CLEAR_STATE } from '../actions/clearActions';

interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: (traceOptions: object) => StoreEnhancer;
}

interface Params {
    customReducers?: any;
    initialState?: InitialState;
}

export default ({ customReducers = {}, initialState }: Params = {}) => {
    const appReducer = createAppReducer(customReducers);

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
