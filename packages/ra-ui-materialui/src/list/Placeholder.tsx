import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system';

interface PlaceholderProps extends MUIStyledCommonProps<Theme> {
    className?: string;
}

export const Placeholder = (inProps: PlaceholderProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    return <Root {...props}>&nbsp;</Root>;
};
const PREFIX = 'RaPlaceholder';

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.grey[300],
    display: 'flex',
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaPlaceholder: 'root';
    }

    interface ComponentsPropsList {
        RaPlaceholder: Partial<PlaceholderProps>;
    }

    interface Components {
        RaPlaceholder?: {
            defaultProps?: ComponentsPropsList['RaPlaceholder'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaPlaceholder'];
        };
    }
}
