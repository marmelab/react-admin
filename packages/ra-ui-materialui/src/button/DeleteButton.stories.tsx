import * as React from 'react';
import { createTheme } from '@mui/material';
import type { PaletteColor } from '@mui/material';
import { DeleteButton } from './DeleteButton';
import { Form } from 'ra-core';
import { AdminContext } from '../AdminContext';

export default { title: 'ra-ui-materialui/button/DeleteButton' };

export const Basic = () => (
    <AdminContext>
        <Form record={{ id: 1 }}>
            <DeleteButton label="Delete" />
        </Form>
    </AdminContext>
);

export const WithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <Form record={{ id: 1 }}>
            <DeleteButton label="Delete" />
        </Form>
    </AdminContext>
);

/**
 * Adding new theme tokens to the palette
 * @see https://mui.com/material-ui/experimental-api/css-theme-variables/customization/#typescript
 */
const theme = createTheme({
    palette: {
        error: {
            main: '#FDDBD3',
        },
    },
});

declare module '@mui/material/styles' {
    interface Palette {
        userDefined?: PaletteColor;
    }
    interface PaletteOptions {
        userDefined?: PaletteColor;
    }
}

/**
 * Adding new theme tokens to the Button
 * https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants
 */
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        userDefined: true;
    }
}
