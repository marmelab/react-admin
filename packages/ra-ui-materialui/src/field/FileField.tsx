import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';
import classnames from 'classnames';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

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
export const FileField = (props: FileFieldProps) => {
    const {
        className,
        emptyText,
        source,
        title,
        src,
        target,
        download,
        ping,
        rel,
        ...rest
    } = props;
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
            <Root
                className={classnames(FileFieldClasses.root, className)}
                {...sanitizeFieldRestProps(rest)}
            />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <StyledList
                className={classnames(FileFieldClasses.root, className)}
                {...sanitizeFieldRestProps(rest)}
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
                                download={download}
                                ping={ping}
                                rel={rel}
                            >
                                {fileTitleValue}
                            </a>
                        </li>
                    );
                })}
            </StyledList>
        );
    }

    const titleValue = get(record, title) || title;

    return (
        <Root
            className={classnames(FileFieldClasses.root, className)}
            {...sanitizeFieldRestProps(rest)}
        >
            <a
                href={sourceValue}
                title={titleValue}
                target={target}
                download={download}
                ping={ping}
                rel={rel}
            >
                {titleValue}
            </a>
        </Root>
    );
};

FileField.defaultProps = {
    addLabel: true,
};

export interface FileFieldProps extends PublicFieldProps, InjectedFieldProps {
    src?: string;
    title?: string;
    target?: string;
    download?: boolean | string;
    ping?: string;
    rel?: string;
}

FileField.propTypes = {
    ...fieldPropTypes,
    src: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.string,
    download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    ping: PropTypes.string,
    rel: PropTypes.string,
};

const PREFIX = 'RaFileField';

export const FileFieldClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled('div', { name: PREFIX })({
    [`&.${FileFieldClasses.root}`]: { display: 'inline-block' },
});

const StyledList = styled('ul')({
    [`&.${FileFieldClasses.root}`]: { display: 'inline-block' },
});
