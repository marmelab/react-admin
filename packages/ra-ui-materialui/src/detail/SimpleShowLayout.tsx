import * as React from 'react';
import { Children, isValidElement, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, StackProps } from '@mui/material';
import { SxProps } from '@mui/system';
import clsx from 'clsx';
import {
    RaRecord,
    useRecordContext,
    OptionalRecordContextProvider,
} from 'ra-core';
import { Labeled } from '../Labeled';

/**
 * Layout for a Show view showing fields in one column.
 *
 * It pulls the record from the RecordContext. It renders the record fields in
 * a single-column layout (via Material UI's `<Stack>` component).
 * `<SimpleShowLayout>` delegates the actual rendering of fields to its children.
 * It wraps each field inside a `<Labeled>` component to add a label.
 *
 * @example
 * // in src/posts.js
 * import * as React from "react";
 * import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *
 * export const PostShow = () => (
 *     <Show>
 *         <SimpleShowLayout>
 *             <TextField source="title" />
 *         </SimpleShowLayout>
 *     </Show>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostShow } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" show={PostShow} />
 *     </Admin>
 * );
 *
 * @param {SimpleShowLayoutProps} props
 * @param {string} props.className A className to apply to the page content.
 * @param {ElementType} props.component The component to use as root component (div by default).
 * @param {ReactNode} props.divider An optional divider between each field, passed to `<Stack>`.
 * @param {number} props.spacing The spacing to use between each field, passed to `<Stack>`. Defaults to 1.
 * @param {Object} props.sx Custom style object.
 */
export const SimpleShowLayout = (props: SimpleShowLayoutProps) => {
    const { className, children, spacing = 1, sx, ...rest } = props;
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} sx={sx}>
                <Stack
                    spacing={spacing}
                    {...sanitizeRestProps(rest)}
                    className={SimpleShowLayoutClasses.stack}
                >
                    {Children.map(children, field =>
                        field && isValidElement<any>(field) ? (
                            <Labeled
                                key={field.props.source}
                                className={clsx(
                                    'ra-field',
                                    field.props.source &&
                                        `ra-field-${field.props.source}`,
                                    SimpleShowLayoutClasses.row,
                                    field.props.className
                                )}
                            >
                                {field}
                            </Labeled>
                        ) : null
                    )}
                </Stack>
            </Root>
        </OptionalRecordContextProvider>
    );
};

export interface SimpleShowLayoutProps extends StackProps {
    children: ReactNode;
    className?: string;
    record?: RaRecord;
    sx?: SxProps;
}

const PREFIX = 'RaSimpleShowLayout';

export const SimpleShowLayoutClasses = {
    stack: `${PREFIX}-stack`,
    row: `${PREFIX}-row`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    [`& .${SimpleShowLayoutClasses.stack}`]: {},
    [`& .${SimpleShowLayoutClasses.row}`]: {
        display: 'inline',
    },
}));

const sanitizeRestProps = ({
    record,
    resource,
    initialValues,
    translate,
    ...rest
}: any) => rest;
