import { type ComponentsOverrides, styled } from '@mui/material';
import type { DatagridProps } from './Datagrid';

export const DatagridPrefix = 'RaDatagrid';

export const DatagridClasses = {
    root: `${DatagridPrefix}-root`,
    table: `${DatagridPrefix}-table`,
    tableWrapper: `${DatagridPrefix}-tableWrapper`,
    thead: `${DatagridPrefix}-thead`,
    tbody: `${DatagridPrefix}-tbody`,
    headerRow: `${DatagridPrefix}-headerRow`,
    headerCell: `${DatagridPrefix}-headerCell`,
    checkbox: `${DatagridPrefix}-checkbox`,
    row: `${DatagridPrefix}-row`,
    clickableRow: `${DatagridPrefix}-clickableRow`,
    rowEven: `${DatagridPrefix}-rowEven`,
    rowOdd: `${DatagridPrefix}-rowOdd`,
    rowCell: `${DatagridPrefix}-rowCell`,
    selectable: `${DatagridPrefix}-selectable`,
    expandHeader: `${DatagridPrefix}-expandHeader`,
    expandIconCell: `${DatagridPrefix}-expandIconCell`,
    expandIcon: `${DatagridPrefix}-expandIcon`,
    expandable: `${DatagridPrefix}-expandable`,
    expanded: `${DatagridPrefix}-expanded`,
    expandedPanel: `${DatagridPrefix}-expandedPanel`,
};

export const DatagridRoot = styled('div', {
    name: DatagridPrefix,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${DatagridClasses.table}`]: {
        tableLayout: 'auto',
    },
    [`& .${DatagridClasses.tableWrapper}`]: {},
    [`& .${DatagridClasses.thead}`]: {},
    [`& .${DatagridClasses.tbody}`]: {},
    [`& .${DatagridClasses.headerRow}`]: {},
    [`& .${DatagridClasses.headerCell}`]: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: (theme.vars || theme).palette.background.paper,
        '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadius,
        },
        '&:last-child': {
            borderTopRightRadius: theme.shape.borderRadius,
        },
    },
    [`& .${DatagridClasses.checkbox}`]: {},
    [`& .${DatagridClasses.row}`]: {},
    [`& .${DatagridClasses.clickableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${DatagridClasses.rowEven}`]: {},
    [`& .${DatagridClasses.rowOdd}`]: {},
    [`& .${DatagridClasses.rowCell}`]: {},
    [`& .${DatagridClasses.expandHeader}`]: {
        padding: 0,
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIconCell}`]: {
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIcon}`]: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    [`& .${DatagridClasses.expandIcon}.${DatagridClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
    [`& .${DatagridClasses.expandedPanel}`]: {},
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDatagrid:
            | 'root'
            | 'table'
            | 'tableWrapper'
            | 'thead'
            | 'tbody'
            | 'headerRow'
            | 'headerCell'
            | 'checkbox'
            | 'row'
            | 'clickableRow'
            | 'rowEven'
            | 'rowOdd'
            | 'rowCell'
            | 'selectable'
            | 'expandHeader'
            | 'expandIconCell'
            | 'expandIcon'
            | 'expandable'
            | 'expandedPanel';
    }

    interface ComponentsPropsList {
        RaDatagrid: Partial<DatagridProps>;
    }

    interface Components {
        RaDatagrid?: {
            defaultProps?: ComponentsPropsList['RaDatagrid'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDatagrid'];
        };
    }
}
