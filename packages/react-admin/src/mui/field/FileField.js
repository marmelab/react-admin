import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

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
}) => {
    const sourceValue = get(record, source);

    if (!sourceValue) {
        return <div className={classnames(classes.root, className)} />;
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul className={classnames(classes.root, className)}>
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
        <div className={classnames(classes.root, className)}>
            <a href={sourceValue} title={titleValue} target={target}>
                {titleValue}
            </a>
        </div>
    );
};

FileField.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
};

export default withStyles(styles)(FileField);
