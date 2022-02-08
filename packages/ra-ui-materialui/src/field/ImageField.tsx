import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import classnames from 'classnames';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import { SxProps } from '@mui/system';

export const ImageField = (props: ImageFieldProps) => {
    const { className, emptyText, source, src, title, ...rest } = props;
    const record = useRecordContext(props);
    const sourceValue = get(record, source);

    if (!sourceValue) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : (
            <div className={className} {...sanitizeFieldRestProps(rest)} />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <List
                className={classnames(ImageFieldClasses.list, className)}
                {...sanitizeFieldRestProps(rest)}
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
                                className={ImageFieldClasses.image}
                            />
                        </li>
                    );
                })}
            </List>
        );
    }

    const titleValue = get(record, title) || title;

    return (
        <div className={className} {...sanitizeFieldRestProps(rest)}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue}
                className={ImageFieldClasses.image}
            />
        </div>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
ImageField.displayName = 'ImageField';

ImageField.defaultProps = {
    addLabel: true,
};

ImageField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
};

const PREFIX = 'RaImageField';

export const ImageFieldClasses = {
    list: `${PREFIX}-list`,
    image: `${PREFIX}-image`,
};

const List = styled('ul', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`&.${ImageFieldClasses.list}`]: {
        display: 'flex',
        listStyleType: 'none',
    },
    [`& .${ImageFieldClasses.image}`]: {
        margin: '0.5rem',
        maxHeight: '10rem',
    },
});

export interface ImageFieldProps extends PublicFieldProps, InjectedFieldProps {
    src?: string;
    title?: string;
    sx?: SxProps;
}
