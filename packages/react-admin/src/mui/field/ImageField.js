import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = {
    list: {
        display: 'flex',
        listStyleType: 'none',
    },
    image: {
        margin: '0.5rem',
        maxHeight: '10rem',
    },
};

export const ImageField = ({
    className,
    classes = {},
    record,
    source,
    src,
    title,
}) => {
    const sourceValue = get(record, source);
    if (!sourceValue) {
        return <div className={className} />;
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul className={classnames(classes.list, className)}>
                {sourceValue.map((file, index) => {
                    const titleValue = get(file, title) || title;
                    const srcValue = get(file, src) || title;

                    return (
                        <li key={index}>
                            <img
                                alt={titleValue}
                                title={titleValue}
                                src={srcValue}
                                className={classes.image}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }

    const titleValue = get(record, title) || title;

    return (
        <div className={className}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue}
                className={classes.image}
            />
        </div>
    );
};

ImageField.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    src: PropTypes.string,
    title: PropTypes.string,
};

export default withStyles(styles)(ImageField);
