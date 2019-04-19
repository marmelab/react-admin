import React, { SFC, ComponentType } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const styles = createStyles({
    list: {
        display: 'flex',
        listStyleType: 'none',
    },
    image: {
        margin: '0.5rem',
        maxHeight: '10rem',
    },
});

interface Props extends FieldProps {
    src?: string;
    title?: string;
}

export const ImageField: SFC<
    Props & InjectedFieldProps & WithStyles<typeof styles>
> = ({ className, classes, record, source, src, title, ...rest }) => {
    const sourceValue = get(record, source);
    if (!sourceValue) {
        return <div className={className} {...sanitizeRestProps(rest)} />;
    }

    if (Array.isArray(sourceValue)) {
        return (
            <ul
                className={classnames(classes.list, className)}
                {...sanitizeRestProps(rest)}
            >
                {sourceValue.map((file, index) => {
                    const fileTitleValue = get(file, title) || title;
                    const srcValue = get(file, src) || title;

                    return (
                        <li key={index}>
                            <img
                                alt={fileTitleValue}
                                title={fileTitleValue}
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
        <div className={className} {...sanitizeRestProps(rest)}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue}
                className={classes.image}
            />
        </div>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
ImageField.displayName = 'ImageField';

const EnhancedImageField = withStyles(styles)(ImageField) as ComponentType<
    Props
>;

EnhancedImageField.defaultProps = {
    addLabel: true,
};

EnhancedImageField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
};

EnhancedImageField.displayName = 'EnhancedImageField';

export default EnhancedImageField;
