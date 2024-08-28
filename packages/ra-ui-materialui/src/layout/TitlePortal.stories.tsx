import * as React from 'react';
import { PreferencesEditorContextProvider, TestMemoryRouter } from 'ra-core';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';
import { InspectorButton } from '../preferences/InspectorButton';
import { Inspector } from '../preferences/Inspector';

export default {
    title: 'ra-ui-materialui/layout/TitlePortal',
};

export const Basic = () => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);

export const Props = () => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal variant="body1" />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);

export const Sx = () => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal sx={{ color: 'primary.main' }} />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);

export const Configurable = () => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <Inspector />
            <InspectorButton />
            <TitlePortal variant="body1" />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);

export const NonConfigurable = () => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <Inspector />
            <InspectorButton />
            <TitlePortal variant="body1" />
            <Title title="Hello, world" preferenceKey={false} />
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);
