import * as React from 'react';
import { TestMemoryRouter } from 'ra-core';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';

export default {
    title: 'ra-ui-materialui/layout/TitlePortal',
};

export const Basic = () => (
    <TestMemoryRouter>
        <TitlePortal />
        <Title title="Hello, world" />
    </TestMemoryRouter>
);

export const Props = () => (
    <TestMemoryRouter>
        <TitlePortal variant="body1" />
        <Title title="Hello, world" />
    </TestMemoryRouter>
);

export const Sx = () => (
    <TestMemoryRouter>
        <TitlePortal sx={{ color: 'primary.main' }} />
        <Title title="Hello, world" />
    </TestMemoryRouter>
);
