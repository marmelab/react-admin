import React from 'react';
import Labeled from '../input/Labeled';

const Tab = ({ label, icon, children, ...rest }) => (
    <span>
        {React.Children.map(
            children,
            field =>
                field && (
                    <div
                        key={field.props.source}
                        style={field.props.style}
                        className={`aor-field aor-field-${field.props.source}`}
                    >
                        {field.props.addLabel ? (
                            <Labeled
                                {...rest}
                                label={field.props.label}
                                source={field.props.source}
                            >
                                {field}
                            </Labeled>
                        ) : typeof field.type === 'string' ? (
                            field
                        ) : (
                            React.cloneElement(field, rest)
                        )}
                    </div>
                )
        )}
    </span>
);

export default Tab;
