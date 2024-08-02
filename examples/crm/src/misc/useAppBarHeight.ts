import { useMediaQuery, useTheme } from '@mui/material';

const DENSE_NAVBAR_HEIGHT = 48;
const DENSE_NAVBAR_HEIGHT_MOBILE = 64;

export default function useAppBarHeight(): number {
    const { breakpoints } = useTheme();
    const queryDesktop = breakpoints.up('sm');
    return useMediaQuery(queryDesktop)
        ? DENSE_NAVBAR_HEIGHT
        : DENSE_NAVBAR_HEIGHT_MOBILE;
}
