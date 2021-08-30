import * as React from 'react';
import { ReactElement, memo } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    useMediaQuery,
    Theme,
} from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { shallowEqual } from 'react-redux';
import {
    useListSortContext,
    useTranslate,
    getFieldLabelTranslationArgs,
} from 'ra-core';

/**
 * A button allowing to change the sort field and order.
 *
 * To be used inside a ListContext (e.g. inside a <List> or <ReferenceManyField>)
 *
 * Expects one 'fields' prop, containing an array of field strings that shall
 * be used and displayed for sorting.
 *
 * When users clicks on the <SortButton>, they see a dropdown list with the
 * proposed sorting fields. Once they click on one of these fields, the related
 * list refreshes, re-sorted.
 *
 * @example
 *
 * import * as React from 'react';
 * import { TopToolbar, SortButton, CreateButton, ExportButton } from 'react-admin';
 *
 * const ListActions = props => (
 *     <TopToolbar>
 *         <SortButton fields={['reference', 'sales', 'stock']} />
 *         <CreateButton basePath={props.basePath} />
 *         <ExportButton />
 *     </TopToolbar>
 * );
 */
const SortButton = (props: SortButtonProps) => {
    const { fields, label = 'ra.sort.sort_by', icon = defaultIcon } = props;
    const { resource, currentSort, setSort } = useListSortContext();
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeSort = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
        const field = event.currentTarget.dataset.sort;
        setSort(
            field,
            field === currentSort.field
                ? inverseOrder(currentSort.order)
                : 'ASC'
        );
        setAnchorEl(null);
    };

    const buttonLabel = translate(label, {
        field: translate(
            ...getFieldLabelTranslationArgs({
                resource,
                source: currentSort.field,
            })
        ),
        order: translate(`ra.sort.${currentSort.order}`),
        _: label,
    });

    return (
        <>
            {isXSmall ? (
                <Tooltip title={buttonLabel}>
                    <IconButton
                        aria-label={buttonLabel}
                        color="primary"
                        onClick={handleClick}
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color="primary"
                    onClick={handleClick}
                    startIcon={icon}
                    endIcon={<ArrowDropDownIcon />}
                    size="small"
                >
                    {buttonLabel}
                </Button>
            )}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {fields.map(field => (
                    <MenuItem
                        onClick={handleChangeSort}
                        data-sort={field}
                        key={field}
                    >
                        {translate(
                            ...getFieldLabelTranslationArgs({
                                resource,
                                source: field,
                            })
                        )}{' '}
                        {translate(
                            `ra.sort.${
                                currentSort.field === field
                                    ? inverseOrder(currentSort.order)
                                    : 'ASC'
                            }`
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const defaultIcon = <SortIcon />;

const inverseOrder = (sort: string) => (sort === 'ASC' ? 'DESC' : 'ASC');

const arePropsEqual = (prevProps, nextProps) =>
    shallowEqual(prevProps.fields, nextProps.fields);

export interface SortButtonProps {
    fields: string[];
    label?: string;
    icon?: ReactElement;
}

export default memo(SortButton, arePropsEqual);
