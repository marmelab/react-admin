import * as React from 'react';
import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import {
    ExtractRecordPaths,
    HintedString,
    useFieldValue,
    useTranslate,
} from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import { SxProps } from '@mui/system';
import { Link } from '@mui/material';

/**
 * Render a link to a file based on a path contained in a record field
 *
 * @example
 * import { FileField } from 'react-admin';
 *
 * <FileField source="url" title="title" />
 *
 * // renders the record { id: 123, url: 'doc.pdf', title: 'Presentation' } as
 * <div>
 *     <a href="doc.pdf" title="Presentation">Presentation</a>
 * </div>
 */
export const FileField = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: FileFieldProps<RecordType>
) => {
    const {
        className,
        emptyText,
        title,
        src,
        target,
        download,
        ping,
        rel,
        ...rest
    } = props;
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
            <Root className={className} {...sanitizeFieldRestProps(rest)} />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <StyledList className={className} {...sanitizeFieldRestProps(rest)}>
                {sourceValue.map((file, index) => {
                    const fileTitleValue = title
                        ? get(file, title, title)
                        : title;
                    const srcValue = src ? get(file, src, title) : title;

                    return (
                        <li key={index}>
                            <Link
                                href={srcValue}
                                title={fileTitleValue}
                                target={target}
                                download={download}
                                ping={ping}
                                rel={rel}
                                variant="body2"
                                onClick={e => e.stopPropagation()}
                            >
                                {fileTitleValue}
                            </Link>
                        </li>
                    );
                })}
            </StyledList>
        );
    }

    return (
        <Root className={className} {...sanitizeFieldRestProps(rest)}>
            <Link
                href={sourceValue?.toString()}
                title={titleValue}
                target={target}
                download={download}
                ping={ping}
                rel={rel}
                variant="body2"
            >
                {titleValue}
            </Link>
        </Root>
    );
};

export interface FileFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType> {
    src?: string;
    title?: HintedString<ExtractRecordPaths<RecordType>>;
    target?: string;
    download?: boolean | string;
    ping?: string;
    rel?: string;
    sx?: SxProps;
}

const PREFIX = 'RaFileField';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-block',
});

const StyledList = styled('ul')({
    display: 'inline-block',
});
