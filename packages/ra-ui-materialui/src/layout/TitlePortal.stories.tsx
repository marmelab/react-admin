import * as React from 'react';
import { PreferencesEditorContextProvider, TestMemoryRouter } from 'ra-core';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';
import { InspectorButton } from '../preferences/InspectorButton';
import { Inspector } from '../preferences/Inspector';
import { Configurable } from '../preferences/Configurable';
import { PageTitleEditor } from './PageTitleConfigurable';

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

export const NonConfigurable = ({ preferenceKey = 'title' }) => (
    <TestMemoryRouter>
        <PreferencesEditorContextProvider>
            <Inspector />
            <InspectorButton />
            <Configurable
                editor={<PageTitleEditor />}
                preferenceKey={preferenceKey}
            >
                <>
                    <TitlePortal variant="body1" />
                    <Title title="Hello, world" nonConfigurable />
                </>
            </Configurable>
        </PreferencesEditorContextProvider>
    </TestMemoryRouter>
);
