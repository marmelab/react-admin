import { LoadingIndicator, LocalesMenuButton } from 'react-admin';

import { ThemeSwapper } from '../themes/ThemeSwapper';

export const AppBarToolbar = () => (
    <>
        <LocalesMenuButton />
        <ThemeSwapper />
        <LoadingIndicator />
    </>
);
