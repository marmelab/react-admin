import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Labeled from '../input/Labeled';

const defaultStyle = { padding: '0 1em 1em 1em' };
export const SimpleShowLayout = ({
    basePath,
    children,
    record,
    resource,
    style = defaultStyle,
}) => (
    <div style={style}>
        {Children.map(children, field => (
            <div
                key={field.props.source}
                style={field.props.style}
                className={`aor-field aor-field-${field.props.source}`}
            >
                {field.props.addLabel ? (
                    <Labeled
                        record={record}
                        resource={resource}
                        basePath={basePath}
                        label={field.props.label}
                        source={field.props.source}
                        disabled={false}
                    >
                        {field}
                    </Labeled>
                ) : typeof field.type === 'string' ? (
                    field
                ) : (
                    React.cloneElement(field, {
                        record,
                        resource,
                        basePath,
                    })
                )}
            </div>
        ))}
    </div>
);

SimpleShowLayout.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    record: PropTypes.object,
    resource: PropTypes.string,
    style: PropTypes.object,
};

export default SimpleShowLayout;
