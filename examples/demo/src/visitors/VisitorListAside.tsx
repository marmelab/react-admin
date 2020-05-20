import React, { FC, ChangeEvent } from 'react';
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
import { TextInput, useTranslate } from 'react-admin';
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
    listItem: {
        paddingLeft: '2em',
    },
    listItemText: {
        margin: 0,
    },
}));

const Aside: FC = props => {
    const { filterValues, setFilters } = props as any;
    const classes = useStyles(props);
    const translate = useTranslate();

    const setFilter = (values: any) => {
        setFilters({ ...filterValues, ...values });
    };

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilter({ q: event.target ? event.target.value : undefined });
    };

    const onSubmit = () => undefined;

    // defining this component here allows to skip passing filterValues and setFilter as props
    const FilterButton: FC<{ label: string; value: any }> = props => {
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
                />
                <List dense disablePadding>
                    <FilterButton
                        value={{
                            last_seen_gte: endOfYesterday().toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.today"
                    />
                    <FilterButton
                        value={{
                            last_seen_gte: startOfWeek(
                                new Date()
                            ).toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.this_week"
                    />
                    <FilterButton
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
                    <FilterButton
                        value={{
                            last_seen_gte: startOfMonth(
                                new Date()
                            ).toISOString(),
                            last_seen_lte: undefined,
                        }}
                        label="resources.customers.filters.this_month"
                    />
                    <FilterButton
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
                    <FilterButton
                        value={{
                            last_seen_gte: undefined,
                            last_seen_lte: subMonths(
                                startOfMonth(new Date()),
                                1
                            ).toISOString(),
                        }}
                        label="resources.customers.filters.earlier"
                    />
                </List>

                <FilterSection
                    icon={MonetizationOnIcon}
                    label="resources.customers.filters.has_ordered"
                />
                <List dense disablePadding>
                    <FilterButton
                        value={{ has_ordered: true }}
                        label="ra.boolean.true"
                    />
                    <FilterButton
                        value={{ has_ordered: false }}
                        label="ra.boolean.false"
                    />
                </List>

                <FilterSection
                    icon={MailIcon}
                    label="resources.customers.filters.has_newsletter"
                />
                <List dense disablePadding>
                    <FilterButton
                        value={{ has_newsletter: true }}
                        label="ra.boolean.true"
                    />
                    <FilterButton
                        value={{ has_newsletter: false }}
                        label="ra.boolean.false"
                    />
                </List>

                <FilterSection
                    icon={LocalOfferIcon}
                    label="resources.customers.filters.group"
                />
                <List dense disablePadding>
                    {segments.map(segment => (
                        <FilterButton
                            value={{ groups: segment.id }}
                            label={segment.name}
                        />
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

const FilterSection: FC<{ label: string; icon: FC }> = ({
    label,
    icon: Icon,
}) => {
    const translate = useTranslate();
    return (
        <Box mt={2} display="flex" alignItems="center">
            <Box mr={1}>
                <Icon />
            </Box>
            <Typography variant="overline">{translate(label)}</Typography>
        </Box>
    );
};

export default Aside;
