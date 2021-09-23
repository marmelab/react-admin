import { makeStyles } from '@material-ui/core/styles';

export const useSimpleFormIteratorStyles = makeStyles(
    theme => ({
        root: {
            padding: 0,
            marginBottom: 0,
            '& > li:last-child': {
                borderBottom: 'none',
            },
        },
        line: {
            display: 'flex',
            listStyleType: 'none',
            borderBottom: `solid 1px ${theme.palette.divider}`,
            [theme.breakpoints.down('xs')]: { display: 'block' },
            '&.fade-enter': {
                opacity: 0.01,
                transform: 'translateX(100vw)',
            },
            '&.fade-enter-active': {
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 500ms ease-in',
            },
            '&.fade-exit': {
                opacity: 1,
                transform: 'translateX(0)',
            },
            '&.fade-exit-active': {
                opacity: 0.01,
                transform: 'translateX(100vw)',
                transition: 'all 500ms ease-in',
            },
        },
        index: {
            [theme.breakpoints.down('sm')]: { display: 'none' },
            marginRight: theme.spacing(1),
        },
        indexContainer: {
            display: 'flex',
            paddingTop: '1em',
            marginRight: theme.spacing(1),
            alignItems: 'center',
        },
        form: { flex: 2 },
        action: {
            paddingTop: '0.5em',
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'RaSimpleFormIterator' }
);
