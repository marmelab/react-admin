import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { TitlePortal } from './TitlePortal';
import { Title } from './Title';

export default {
    title: 'ra-ui-materialui/layout/TitlePortal',
};

export const Basic = () => (
    <MemoryRouter>
        <TitlePortal />
        <Title title="Hello, world" />
    </MemoryRouter>
);

export const Props = () => (
    <MemoryRouter>
        <TitlePortal variant="body1" />
        <Title title="Hello, world" />
    </MemoryRouter>
);

export const Sx = () => (
    <MemoryRouter>
        <TitlePortal sx={{ color: 'primary.main' }} />
        <Title title="Hello, world" />
    </MemoryRouter>
);
