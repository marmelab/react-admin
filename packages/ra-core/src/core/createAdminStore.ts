import { createStore, StoreEnhancer } from 'redux';

import { InitialState } from '../types';
import createAppReducer from '../reducer';

interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: (traceOptions: object) => StoreEnhancer;
}

interface Params {
    customReducers?: any;
    initialState?: InitialState;
}

export default ({ customReducers = {}, initialState }: Params = {}) => {
    const appReducer = createAppReducer(customReducers);

    const typedWindow = typeof window !== 'undefined' && (window as Window);

    const store = createStore(
        appReducer,
        typeof initialState === 'function' ? initialState() : initialState,
        typedWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
            typedWindow.__REDUX_DEVTOOLS_EXTENSION__({
                trace: true,
                traceLimit: 25,
            })
    );
    return store;
};
