import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { useTranslatableContext, RaRecord } from 'ra-core';
import { Labeled } from '../Labeled';

/**
 * Default container for a group of translatable fields inside a TranslatableFields components.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabContent = (
    props: TranslatableFieldsTabContentProps
): ReactElement => {
    const {
        children,
        groupKey = '',
        locale,
        record,
        resource,
        className,
        ...other
    } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();

    const addLabel = Children.count(children) > 1;

    return (
        <Root
            role="tabpanel"
            hidden={selectedLocale !== locale}
            id={`translatable-content-${groupKey}${locale}`}
            aria-labelledby={`translatable-header-${groupKey}${locale}`}
            className={className}
            {...other}
        >
            {Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <div key={field.props.source}>
                        {addLabel ? (
                            <Labeled
                                resource={resource}
                                label={field.props.label}
                                source={field.props.source}
                            >
                                {cloneElement(field, {
                                    ...field.props,
                                    label: getLabel(field.props.source),
                                    record,
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
                                record,
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
    children: ReactNode;
    className?: string;
    formGroupKeyPrefix?: string;
    groupKey: string;
    locale: string;
    record: RaRecord;
    resource: string;
};

const PREFIX = 'RaTranslatableFieldsTabContent';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    borderRadius: 0,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    borderTop: 0,
}));
