import * as React from 'react';
import { FC, ChangeEvent } from 'react';
import {
    Box,
    Card,
    CardContent,
    makeStyles,
    Typography,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOnOutlined';
import MailIcon from '@material-ui/icons/MailOutline';
import LocalOfferIcon from '@material-ui/icons/LocalOfferOutlined';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import { Form } from 'react-final-form';
import TextInput from '../input/TextInput';
import { useTranslate, useListContext } from 'react-admin';
import {
    endOfYesterday,
    startOfWeek,
    subWeeks,
    startOfMonth,
    subMonths,
} from 'date-fns';

import segments from '../segments/data';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            order: -1,
            width: '15em',
            marginRight: '1em',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

const FilterPanel: FC = props => {
    const { filterValues, setFilters } = props as any;
    const classes = useStyles(props);

    const setFilter = (values: any) => {
        setFilters({ ...filterValues, ...values });
    };

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilter({ q: event.target ? event.target.value : undefined });
    };

    const onSubmit = () => undefined;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Form onSubmit={onSubmit} initialValues={filterValues}>
                    {({ handleSubmit }) => (
                        <TextInput
                            resettable
                            helperText={false}
                            source="q"
                            label="Search"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={onSearchChange}
                        />
                    )}
                </Form>

                <FilterSection
                    icon={AccessTimeIcon}
                    label="resources.customers.filters.last_visited"
                >
                    <FilterToggle
                        value={{
                            last_seen_gte: endOfYesterday().toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.today"
                    />
                    <FilterToggle
                        value={{
                            last_seen_gte: startOfWeek(
                                new Date()
                            ).toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.this_week"
                    />
                    <FilterToggle
                        value={{
                            last_seen_gte: subWeeks(
                                startOfWeek(new Date()),
                                1
                            ).toISOString(),
                            last_seen_lte: startOfWeek(
                                new Date()
                            ).toISOString(),
                        }}
                        label="resources.customers.filters.last_week"
                    />
                    <FilterToggle
                        value={{
                            last_seen_gte: startOfMonth(
                                new Date()
                            ).toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.this_month"
                    />
                    <FilterToggle
                        value={{
                            last_seen_gte: subMonths(
                                startOfMonth(new Date()),
                                1
                            ).toISOString(),
                            last_seen_lte: startOfMonth(
                                new Date()
                            ).toISOString(),
                        }}
                        label="resources.customers.filters.last_month"
                    />
                    <FilterToggle
                        value={{
                            last_seen_gte: undefined,
                            last_seen_lte: subMonths(
                                startOfMonth(new Date()),
                                1
                            ).toISOString(),
                        }}
                        label="resources.customers.filters.earlier"
                    />
                </FilterSection>

                <FilterSection
                    icon={MonetizationOnIcon}
                    label="resources.customers.filters.has_ordered"
                >
                    <FilterToggle
                        value={{ has_ordered: true }}
                        label="ra.boolean.true"
                    />
                    <FilterToggle
                        value={{ has_ordered: false }}
                        label="ra.boolean.false"
                    />
                </FilterSection>

                <FilterSection
                    icon={MailIcon}
                    label="resources.customers.filters.has_newsletter"
                >
                    <FilterToggle
                        value={{ has_newsletter: true }}
                        label="ra.boolean.true"
                    />
                    <FilterToggle
                        value={{ has_newsletter: false }}
                        label="ra.boolean.false"
                    />
                </FilterSection>

                <FilterSection
                    icon={LocalOfferIcon}
                    label="resources.customers.filters.group"
                >
                    {segments.map(segment => (
                        <FilterToggle
                            value={{ groups: segment.id }}
                            label={segment.name}
                            key={segment.id}
                        />
                    ))}
                </FilterSection>
            </CardContent>
        </Card>
    );
};

const FilterSection: FC<{ label: string; icon: FC }> = ({
    label,
    icon: Icon,
    children,
}) => {
    const translate = useTranslate();
    return (
        <>
            <Box mt={2} display="flex" alignItems="center">
                <Box mr={1}>
                    <Icon />
                </Box>
                <Typography variant="overline">{translate(label)}</Typography>
            </Box>
            <List dense disablePadding>
                {children}
            </List>
        </>
    );
};

const useFilterToggleStyles = makeStyles(theme => ({
    listItem: {
        paddingLeft: '2em',
    },
    listItemText: {
        margin: 0,
    },
}));

const FilterToggle: FC<{ label: string; value: any }> = props => {
    const { filterValues, setFilter } = useListContext();
    const translate = useTranslate();
    const classes = useFilterToggleStyles(props);
    const { label, value } = props;
    const isSelected = Object.keys(value).reduce(
        (acc, key) => acc && value[key] == filterValues[key], // eslint-disable-line eqeqeq
        true
    );
    const addFilter = () => {
        if (isSelected) {
            // remove the filter
            const inverseValues = Object.keys(value).reduce(
                (acc, key) => {
                    acc[key] = undefined;
                    return acc;
                },
                {} as any
            );
            setFilter(inverseValues);
        } else {
            setFilter(value);
        }
    };
    return (
        <ListItem
            button
            onClick={addFilter}
            selected={isSelected}
            className={classes.listItem}
        >
            <ListItemText
                primary={translate(label)}
                className={classes.listItemText}
            />
            {isSelected && (
                <ListItemSecondaryAction>
                    <IconButton size="small">
                        <CancelIcon onClick={addFilter} />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

export default FilterPanel;
