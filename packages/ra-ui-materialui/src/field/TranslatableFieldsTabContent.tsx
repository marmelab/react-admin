import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { useTranslatableContext, Record } from 'ra-core';
import { Labeled } from '../input';

const PREFIX = 'RaTranslatableFieldsTabContent';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        flexGrow: 1,
        padding: theme.spacing(2),
        borderRadius: 0,
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        borderTop: 0,
    },
}));

/**
 * Default container for a group of translatable fields inside a TranslatableFields components.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabContent = (
    props: TranslatableFieldsTabContentProps
): ReactElement => {
    const {
        basePath,
        children,
        groupKey = '',
        locale,
        record,
        resource,
        ...other
    } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();

    return (
        <Root
            role="tabpanel"
            hidden={selectedLocale !== locale}
            id={`translatable-content-${groupKey}${locale}`}
            aria-labelledby={`translatable-header-${groupKey}${locale}`}
            className={classes.root}
            {...other}
        >
            {Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <div key={field.props.source}>
                        {field.props.addLabel ? (
                            <Labeled
                                record={record}
                                resource={resource}
                                basePath={basePath}
                                label={field.props.label}
                                source={field.props.source}
                                disabled={false}
                            >
                                {cloneElement(field, {
                                    ...field.props,
                                    label: getLabel(field.props.source),
                                    source: getSource(
                                        field.props.source,
                                        locale
                                    ),
                                })}
                            </Labeled>
                        ) : typeof field === 'string' ? (
                            field
                        ) : (
                            cloneElement(field, {
                                ...field.props,
                                label: getLabel(field.props.source),
                                source: getSource(field.props.source, locale),
                            })
                        )}
                    </div>
                ) : null
            )}
        </Root>
    );
};

export type TranslatableFieldsTabContentProps = {
    basePath: string;
    children: ReactNode;
    formGroupKeyPrefix?: string;
    groupKey: string;
    locale: string;
    record: Record;
    resource: string;
};
