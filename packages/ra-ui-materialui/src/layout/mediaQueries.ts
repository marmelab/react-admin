import { useTheme } from '@material-ui/core/styles';
import useMediaQueryTheme from '@material-ui/core/useMediaQuery/useMediaQueryTheme';

export const useMediaIsXSmall = () => {
    const theme = useTheme();
    return useMediaQueryTheme(theme.breakpoints.down('xs'));
};

export const useMediaIsSmall = () => {
    const theme = useTheme();
    return useMediaQueryTheme(theme.breakpoints.down('sm'));
};

export const useMediaIsDesktop = () => {
    const theme = useTheme();
    return useMediaQueryTheme(theme.breakpoints.up('md'));
};
