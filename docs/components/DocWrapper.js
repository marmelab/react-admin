import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TranslationProvider from '../../packages/ra-core/src/i18n/TranslationProvider';

const store = createStore(() => ({ i18n: { locale: 'en' } }));

const DocWrapper = ({ children }) => (
    <Provider store={store}>
        <TranslationProvider>{children}</TranslationProvider>
    </Provider>
);

export default DocWrapper;
