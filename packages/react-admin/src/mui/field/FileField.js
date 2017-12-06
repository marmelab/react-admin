import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

export const FileField = ({
    className,
    elStyle,
    record,
    source,
    title,
    src,
    target,
}) => {
    const sourceValue = get(record, source);

    if (!sourceValue) {
        return <div className={className} />;
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul className={className} style={elStyle}>
                {sourceValue.map((file, index) => {
                    const titleValue = get(file, title) || title;
                    const srcValue = get(file, src) || title;

                    return (
                        <li key={index}>
                            <a
                                href={srcValue}
                                title={titleValue}
                                target={target}
                            >
                                {titleValue}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    const titleValue = get(record, title) || title;

    return (
        <div style={elStyle}>
            <a href={sourceValue} title={titleValue} target={target}>
                {titleValue}
            </a>
        </div>
    );
};

FileField.propTypes = {
    className: PropTypes.string,
    elStyle: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
};

FileField.defaultProps = {
    elStyle: { display: 'inline-block' },
};

export default FileField;
