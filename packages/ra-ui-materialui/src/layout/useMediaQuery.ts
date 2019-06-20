import { useTheme, getThemeProps } from '@material-ui/styles';
import { useMediaQuery as useMuiMediaQuery, Theme } from '@material-ui/core';

function useMediaQuery(query: (theme: Theme) => string, options) {
    const theme = useTheme() as Theme;
    const props = getThemeProps({
        theme,
        name: 'MuiUseMediaQuery',
        props: {},
    });

    return useMuiMediaQuery(theme ? query(theme) : '', {
        ...props,
        ...options,
    });
}

export default useMediaQuery;
