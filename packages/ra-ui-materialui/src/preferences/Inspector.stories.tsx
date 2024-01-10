import * as React from 'react';
import { PreferencesEditorContextProvider } from 'ra-core';
import { InspectorButton } from './InspectorButton';
import { Inspector as InspectorUI } from './Inspector';

export default {
    title: 'ra-ui-materialui/preferences/Inspector',
};

export const Inspector = () => (
    <PreferencesEditorContextProvider>
        <InspectorUI />
        <InspectorButton />
    </PreferencesEditorContextProvider>
);
