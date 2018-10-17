import React from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { TranslationProvider } from 'ra-core';
import merge from 'lodash/merge';

const defaultStore = {
    admin: {
        resources: {},
        references: { possibleValues: {} },
        ui: { viewVersion: 1 },
    },
    form: formReducer(),
    i18n: { locale: 'en', messages: {} },
};

/**
 * Simulate a react-admin context in unit tests
 *
 * Pass custom store values as store prop
 *
 * @example
 * // in an enzyme test
 * const wrapper = render(
 *     <AdminContext store={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         <Show {...defaultShowProps} />
 *     </AdminContext>
 * );
 */
const TestContext = ({ store, children }) => {
    const storeWithDefault = createStore(() => merge(store, defaultStore));
    return (
        <Provider store={storeWithDefault}>
            <TranslationProvider>{children}</TranslationProvider>
        </Provider>
    );
};

TestContext.propTypes = {
    store: PropTypes.object,
    children: PropTypes.node,
};

TestContext.defaultProps = {
    store: {},
};

export default TestContext;
