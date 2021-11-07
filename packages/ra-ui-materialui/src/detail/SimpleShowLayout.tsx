import * as React from 'react';
import {
    Children,
    isValidElement,
    cloneElement,
    ReactNode,
    ElementType,
} from 'react';
import { styled } from '@mui/material/styles';
import { Card, Stack } from '@mui/material';
import { ResponsiveStyleValue, SxProps } from '@mui/system';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Record, useRecordContext, useResourceContext } from 'ra-core';

import { Labeled } from '../input';

/**
 * Simple Layout for a Show view, showing fields in one column.
 *
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its children. Children should be Field-like components.
 *
 * @example
 *     // in src/posts.js
 *     import * as React from "react";
 *     import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *
 *     export const PostShow = () => (
 *         <Show>
 *             <SimpleShowLayout>
 *                 <TextField source="title" />
 *             </SimpleShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import * as React from "react";
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 *
 * @param {SimpleShowLayoutProps} props
 * @param {string} props.className A className to apply to the page content.
 * @param {ElementType} props.component The component to use as root component (div by default).
 * @param {ReactNode} props.divider An optional divider btween each field, passed to `<Stack>`.
 * @param {number} props.spacing The spacing to use between each field, passed to `<Stack>`. Defaults to 1.
 */
export const SimpleShowLayout = (props: SimpleShowLayoutProps) => {
    const {
        className,
        children,
        component: Component = Root,
        divider,
        spacing = 1,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    return (
        <Component className={className} {...sanitizeRestProps(rest)}>
            <Stack
                spacing={spacing}
                divider={divider}
                className={SimpleShowLayoutClasses.stack}
            >
                {Children.map(children, field =>
                    field && isValidElement<any>(field) ? (
                        <div
                            key={field.props.source}
                            className={classnames(
                                `ra-field ra-field-${field.props.source}`,
                                SimpleShowLayoutClasses.row,
                                field.props.className
                            )}
                        >
                            {field.props.addLabel ? (
                                <Labeled
                                    record={record}
                                    resource={resource}
                                    label={field.props.label}
                                    source={field.props.source}
                                    disabled={false}
                                    fullWidth={field.props.fullWidth}
                                >
                                    {field}
                                </Labeled>
                            ) : typeof field.type === 'string' ? (
                                field
                            ) : (
                                cloneElement(field, {
                                    record,
                                    resource,
                                })
                            )}
                        </div>
                    ) : null
                )}
            </Stack>
        </Component>
    );
};

export interface SimpleShowLayoutProps {
    className?: string;
    children: ReactNode;
    component?: ElementType;
    divider?: ReactNode;
    record?: Record;
    resource?: string;
    spacing?: ResponsiveStyleValue<number | string>;
    sx?: SxProps;
}

SimpleShowLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    component: PropTypes.elementType,
    record: PropTypes.object,
    resource: PropTypes.string,
    spacing: PropTypes.any,
    sx: PropTypes.any,
};

const PREFIX = 'RaSimpleShowLayout';

export const SimpleShowLayoutClasses = {
    stack: `${PREFIX}-stack`,
    row: `${PREFIX}-row`,
};

const Root = styled(Card, { name: PREFIX })(({ theme }) => ({
    flex: 1,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    [`& .${SimpleShowLayoutClasses.stack}`]: {},
    [`& .${SimpleShowLayoutClasses.row}`]: {},
}));

const sanitizeRestProps = ({
    children,
    className,
    record,
    resource,
    basePath,
    version,
    initialValues,
    translate,
    ...rest
}: any) => rest;
