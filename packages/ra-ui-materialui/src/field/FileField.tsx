import React, { SFC, ComponentType } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const styles = createStyles({
    root: { display: 'inline-block' },
});

interface Props extends FieldProps {
    src?: string;
    title?: string;
    target?: string;
}

export const FileField: SFC<Props & InjectedFieldProps & WithStyles<typeof styles>> = ({
    classes,
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
        return <div className={classnames(classes.root, className)} {...sanitizeRestProps(rest)} />;
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul className={classnames(classes.root, className)} {...sanitizeRestProps(rest)}>
                {sourceValue.map((file, index) => {
                    const fileTitleValue = get(file, title) || title;
                    const srcValue = get(file, src) || title;

                    return (
                        <li key={index}>
                            <a href={srcValue} title={fileTitleValue} target={target}>
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
        <div className={classnames(classes.root, className)} {...sanitizeRestProps(rest)}>
            <a href={sourceValue} title={titleValue} target={target}>
                {titleValue}
            </a>
        </div>
    );
};

const EnhancedFileField = withStyles(styles)(FileField) as ComponentType<Props>;

EnhancedFileField.defaultProps = {
    addLabel: true,
};

EnhancedFileField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
};

EnhancedFileField.displayName = 'EnhancedFileField';

export default EnhancedFileField;
