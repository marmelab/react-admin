import * as React from 'react';
import { TestMemoryRouter } from 'ra-core';
import { PreferencesEditorContextProvider } from 'ra-core';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';

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
