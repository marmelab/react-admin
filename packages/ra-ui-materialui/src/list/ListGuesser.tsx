import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Inbox from '@mui/icons-material/Inbox';

import {
    ListBase,
    getElementsFromRecords,
    InferredElement,
    useListContext,
    useResourceContext,
    RaRecord,
    usePrevious,
    useLocation,
    useTranslate,
} from 'ra-core';

import { ListProps } from './List';
import { ListView, ListViewProps } from './ListView';
import { listFieldTypes } from './listFieldTypes';
import { capitalize, singularize } from 'inflection';

/**
 * List component rendering a <DataTable> based on the result of the
 * dataProvider.getList() call.
 *
 * The result (choice and type of columns) isn't configurable, but the
 * <ListGuesser> outputs the <DataTable> it has guessed to the console so that
 * developers can start from there.
 *
 * To be used as the list prop of a <Resource>.
 *
 * @example
 *
 * import { Admin, Resource, ListGuesser } from 'react-admin';
 *
 * const App = () => (
 *     <Admin dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Admin>
 * );
 */
export const ListGuesser = <RecordType extends RaRecord = any>(
    props: Omit<ListProps, 'children'> & { enableLog?: boolean }
) => {
    const {
        debounce,
        disableAuthentication,
        disableSyncWithLocation,
        empty,
        exporter,
        filter,
        filterDefaultValues,
        perPage,
        queryOptions,
        resource,
        sort,
        ...rest
    } = props;
    // force a rerender of this component when any list parameter changes
    // otherwise the ListBase won't be rerendered when the sort changes
    // and the following check won't be performed
    useLocation();
    // keep previous data, unless the resource changes
    const resourceFromContext = useResourceContext(props);
    const previousResource = usePrevious(resourceFromContext);
    const keepPreviousData = previousResource === resourceFromContext;
    return (
        <ListBase<RecordType>
            debounce={debounce}
            disableAuthentication={disableAuthentication}
            disableSyncWithLocation={disableSyncWithLocation}
            empty={empty === undefined ? <ListGuesserEmpty /> : empty}
            exporter={exporter}
            filter={filter}
            filterDefaultValues={filterDefaultValues}
            perPage={perPage}
            queryOptions={{
                placeholderData: previousData =>
                    keepPreviousData ? previousData : undefined,
            }}
            resource={resource}
            sort={sort}
        >
            <ListGuesserView {...rest} />
        </ListBase>
    );
};

export const ListGuesserView = (
    props: Omit<ListViewProps, 'children'> & { enableLog?: boolean }
) => {
    const { data } = useListContext();
    const resource = useResourceContext();
    const [child, setChild] = useState<React.ReactNode>(null);
    const { enableLog = process.env.NODE_ENV === 'development', ...rest } =
        props;

    useEffect(() => {
        setChild(null);
    }, [resource]);

    useEffect(() => {
        if (data && data.length > 0 && !child) {
            const inferredElements = getElementsFromRecords(
                data,
                listFieldTypes
            );
            const inferredChild = new InferredElement(
                listFieldTypes.table,
                null,
                inferredElements
            );
            const inferredChildElement = inferredChild.getElement();
            const representation = inferredChild.getRepresentation();
            if (!resource) {
                throw new Error(
                    'Cannot use <ListGuesser> outside of a ResourceContext'
                );
            }
            if (!inferredChildElement || !representation) {
                return;
            }

            setChild(inferredChildElement);

            const components = ['List']
                .concat(
                    Array.from(
                        new Set(
                            Array.from(representation.matchAll(/<([^/\s>]+)/g))
                                .map(match => match[1])
                                .filter(component => component !== 'span')
                        )
                    )
                )
                .filter(component => !component.match(/[A-Za-z]+\.[A-Za-z]+/i))
                .sort();

            if (enableLog) {
                console.log(
                    `Guessed List:

import { ${components.join(', ')} } from 'react-admin';

export const ${capitalize(singularize(resource))}List = () => (
    <List>
${inferredChild.getRepresentation()}
    </List>
);`
                );
            }
        }
    }, [data, child, resource, enableLog]);

    return <ListView {...rest}>{child}</ListView>;
};

const ListGuesserEmpty = (inProps: ListGuesserEmptyProps) => {
    const props = useThemeProps({
        props: inProps,
        name: LIST_GUESSER_EMPTY_PREFIX,
    });
    const { className } = props;
    const translate = useTranslate();

    return (
        <ListGuesserEmptyRoot className={className}>
            <Box className={ListGuesserEmptyClasses.message}>
                <Inbox className={ListGuesserEmptyClasses.icon} />
                <Typography variant="h4" paragraph>
                    {translate('ra.guesser.empty.title', {
                        _: 'No data to display',
                    })}
                </Typography>
                <Typography variant="body1">
                    {translate('ra.guesser.empty.message', {
                        _: 'Please check your data provider',
                    })}
                </Typography>
            </Box>
        </ListGuesserEmptyRoot>
    );
};

interface ListGuesserEmptyProps {
    className?: string;
}

const LIST_GUESSER_EMPTY_PREFIX = 'RaListGuesserEmpty';

const ListGuesserEmptyClasses = {
    message: `${LIST_GUESSER_EMPTY_PREFIX}-message`,
    icon: `${LIST_GUESSER_EMPTY_PREFIX}-icon`,
};

const ListGuesserEmptyRoot = styled('span', {
    name: LIST_GUESSER_EMPTY_PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${ListGuesserEmptyClasses.message}`]: {
        textAlign: 'center',
        margin: '0 1em',
        color: (theme.vars || theme).palette.text.disabled,
    },
    [`& .${ListGuesserEmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
}));
