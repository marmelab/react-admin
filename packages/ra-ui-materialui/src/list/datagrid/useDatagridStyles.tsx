import { makeStyles } from '@material-ui/core/styles';

const useDatagridStyles = makeStyles(
    theme => ({
        table: {
            tableLayout: 'auto',
        },
        thead: {},
        tbody: {},
        headerRow: {},
        headerCell: {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: theme.palette.background.paper,
            '&:first-child': {
                borderTopLeftRadius: theme.shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: theme.shape.borderRadius,
            },
        },
        checkbox: {},
        row: {},
        clickableRow: {
            cursor: 'pointer',
        },
        rowEven: {},
        rowOdd: {},
        rowCell: {},
        expandHeader: {
            padding: 0,
            width: theme.spacing(6),
        },
        expandIconCell: {
            width: theme.spacing(6),
        },
        expandIcon: {
            padding: theme.spacing(1),
            transform: 'rotate(-90deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expanded: {
            transform: 'rotate(0deg)',
        },
        expandedPanel: {},
    }),
    { name: 'RaDatagrid' }
);

export default useDatagridStyles;
