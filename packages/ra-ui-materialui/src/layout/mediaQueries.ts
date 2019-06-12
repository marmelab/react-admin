import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const useMediaIsXSmall = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('xs'));
};

export const useMediaIsSmall = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('sm'));
};

export const useMediaIsDesktop = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up('md'));
};
