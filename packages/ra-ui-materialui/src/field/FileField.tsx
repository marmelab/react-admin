import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const useStyles = makeStyles(
    {
        root: { display: 'inline-block' },
    },
    { name: 'RaFileField' }
);

interface Props extends FieldProps {
    src?: string;
    title?: string;
    target?: string;
    classes?: object;
}

const FileField: FunctionComponent<Props & InjectedFieldProps> = ({
    className,
    classes: classesOverride,
    record,
    source,
    title,
    src,
    target,
    ...rest
}) => {
    const sourceValue = get(record, source);
    const classes = useStyles({ classes: classesOverride });

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
                    const fileTitleValue = get(file, title) || title;
                    const srcValue = get(file, src) || title;

                    return (
                        <li key={index}>
                            <a
                                href={srcValue}
                                title={fileTitleValue}
                                target={target}
                            >
                                {fileTitleValue}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    const titleValue = get(record, title) || title;

    return (
        <div
            className={classnames(classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <a href={sourceValue} title={titleValue} target={target}>
                {titleValue}
            </a>
        </div>
    );
};

FileField.defaultProps = {
    addLabel: true,
};

FileField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
};

export default FileField;
