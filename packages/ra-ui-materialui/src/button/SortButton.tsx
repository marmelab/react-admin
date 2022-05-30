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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    useListSortContext,
    useTranslate,
    useTranslateLabel,
    shallowEqual,
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
 * const ListActions = () => (
 *     <TopToolbar>
 *         <SortButton fields={['reference', 'sales', 'stock']} />
 *         <CreateButton />
 *         <ExportButton />
 *     </TopToolbar>
 * );
 */
const SortButton = (props: SortButtonProps) => {
    const { fields, label = 'ra.sort.sort_by', icon = defaultIcon } = props;
    const { resource, sort, setSort } = useListSortContext();
    const translate = useTranslate();
    const translateLabel = useTranslateLabel();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
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
        setSort({
            field,
            order: field === sort.field ? inverseOrder(sort.order) : 'ASC',
        });
        setAnchorEl(null);
    };

    const buttonLabel = translate(label, {
        field: translateLabel({
            resource,
            source: sort.field,
        }),
        order: translate(`ra.sort.${sort.order}`),
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
                        size="large"
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            ) : (
                <StyledButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color="primary"
                    onClick={handleClick}
                    startIcon={icon}
                    endIcon={<ArrowDropDownIcon />}
                    size="small"
                >
                    {buttonLabel}
                </StyledButton>
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
                        {translateLabel({
                            resource,
                            source: field,
                        })}{' '}
                        {translate(
                            `ra.sort.${
                                sort.field === field
                                    ? inverseOrder(sort.order)
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
    icon?: ReactElement;
    label?: string;
    resource?: string;
}

const StyledButton = styled(Button, {
    name: 'RaSortButton',
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
    '& .MuiButton-endIcon': { ml: 0 },
});

export default memo(SortButton, arePropsEqual);
