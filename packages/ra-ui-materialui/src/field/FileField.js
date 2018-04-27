import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import sanitizeRestProps from './sanitizeRestProps';

const styles = {
    root: { display: 'inline-block' },
};

export const FileField = ({
    classes = {},
    className,
    record,
    source,
    title,
    src,
    target,
    ...rest
}) => {
    const sourceValue = get(record, source);

    if (!sourceValue) {
        return (
            <div
                className={classnames(classes.root, className)}
                {...sanitizeRestProps(rest)}
            />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul
                className={classnames(classes.root, className)}
                {...sanitizeRestProps(rest)}
            >
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
        <div className={classnames(classes.root, className)} {...rest}>
            <a href={sourceValue} title={titleValue} target={target}>
                {titleValue}
            </a>
        </div>
    );
};

FileField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    record: PropTypes.object,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
};

export default withStyles(styles)(FileField);
