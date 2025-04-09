import type {} from '@mui/material/themeCssVarsAugmentation';

declare module '@mui/material/styles' {
    interface PaletteOptions {
        bulkActionsToolbarColor?: string;
        bulkActionsToolbarBackgroundColor?: string;
    }
    interface Palette {
        bulkActionsToolbarColor: string;
        bulkActionsToolbarBackgroundColor: string;
    }
}
