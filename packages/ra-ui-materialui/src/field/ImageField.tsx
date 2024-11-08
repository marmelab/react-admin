import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import get from 'lodash/get';
import {
    ExtractRecordPaths,
    HintedString,
    useFieldValue,
    useTranslate,
} from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import { SxProps } from '@mui/system';

export const ImageField = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: ImageFieldProps<RecordType>
) => {
    const { className, emptyText, src, title, ...rest } = props;
    const sourceValue = useFieldValue(props);
    const titleValue =
        useFieldValue({
            ...props,
            // @ts-ignore We ignore here because title might be a custom label or undefined instead of a field name
            source: title,
        })?.toString() ?? title;
    const translate = useTranslate();

    if (!sourceValue) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : (
            <Typography
                component="div"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <Root className={className} {...sanitizeFieldRestProps(rest)}>
                <ul className={ImageFieldClasses.list}>
                    {sourceValue.map((file, index) => {
                        const fileTitleValue = title
                            ? get(file, title, title)
                            : title;
                        const srcValue = src ? get(file, src, title) : title;

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
                </ul>
            </Root>
        );
    }

    return (
        <Root className={className} {...sanitizeFieldRestProps(rest)}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue?.toString()}
                className={ImageFieldClasses.image}
            />
        </Root>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
ImageField.displayName = 'ImageField';

const PREFIX = 'RaImageField';

export const ImageFieldClasses = {
    list: `${PREFIX}-list`,
    image: `${PREFIX}-image`,
};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${ImageFieldClasses.list}`]: {
        display: 'flex',
        listStyleType: 'none',
    },
    [`& .${ImageFieldClasses.image}`]: {
        margin: '0.25rem',
        width: 200,
        height: 100,
        objectFit: 'contain',
    },
});

export interface ImageFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType> {
    src?: string;
    title?: HintedString<ExtractRecordPaths<RecordType>>;
    sx?: SxProps;
}
