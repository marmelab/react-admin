import * as React from 'react';
import { Children, isValidElement, cloneElement, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Record } from 'ra-core';

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
 *     export const PostShow = (props) => (
 *         <Show {...props}>
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
 */
export const SimpleShowLayout = ({
    className,
    children,
    record,
    resource,
    spacing = 1,
    version,
    ...rest
}: SimpleShowLayoutProps) => (
    <StyledStack
        spacing={spacing}
        className={className}
        key={version}
        {...sanitizeRestProps(rest)}
    >
        {Children.map(children, field =>
            field && isValidElement<any>(field) ? (
                <div
                    key={field.props.source}
                    className={classnames(
                        `ra-field ra-field-${field.props.source}`,
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
    </StyledStack>
);

export interface SimpleShowLayoutProps {
    className?: string;
    children: ReactNode;
    record?: Record;
    resource?: string;
    spacing?: ResponsiveStyleValue<number | string>;
    version?: number;
}

SimpleShowLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    record: PropTypes.object,
    resource: PropTypes.string,
    spacing: PropTypes.any,
    version: PropTypes.number,
};

const PREFIX = 'RaSimpleShowLayout';

const StyledStack = styled(Card, { name: PREFIX })(({ theme }) => ({
    flex: 1,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
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
