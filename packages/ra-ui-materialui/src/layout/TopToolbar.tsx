import * as React from 'react';
import {
    useMediaQuery,
    type Theme,
    Toolbar,
    type ToolbarProps,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

export const TopToolbar = (inProps: ToolbarProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    return (
        <StyledToolbar
            disableGutters
            variant={isXSmall ? 'regular' : 'dense'}
            {...sanitizeToolbarRestProps(props)}
        />
    );
};

export default TopToolbar;
const PREFIX = 'RaTopToolbar';

const StyledToolbar = styled(Toolbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    whiteSpace: 'nowrap',
    flex: '0 1 auto',
    padding: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        flex: '0 1 100%',
    },
    [theme.breakpoints.down('sm')]: {
        backgroundColor: (theme.vars || theme).palette.background.paper,
        padding: 0,
        paddingBottom: 0,
    },
}));

const sanitizeToolbarRestProps = ({ hasCreate, ...props }: any) => props;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTopToolbar: 'root';
    }

    interface ComponentsPropsList {
        RaTopToolbar: Partial<ToolbarProps>;
    }

    interface Components {
        RaTopToolbar?: {
            defaultProps?: ComponentsPropsList['RaTopToolbar'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTopToolbar'];
        };
    }
}
