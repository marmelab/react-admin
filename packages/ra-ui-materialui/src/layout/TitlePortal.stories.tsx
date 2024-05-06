import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider } from 'ra-core';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';

export default {
    title: 'ra-ui-materialui/layout/TitlePortal',
};

export const Basic = () => (
    <MemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </MemoryRouter>
);

export const Props = () => (
    <MemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal variant="body1" />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </MemoryRouter>
);

export const Sx = () => (
    <MemoryRouter>
        <PreferencesEditorContextProvider>
            <TitlePortal sx={{ color: 'primary.main' }} />
            <Title title="Hello, world" />
        </PreferencesEditorContextProvider>
    </MemoryRouter>
);
