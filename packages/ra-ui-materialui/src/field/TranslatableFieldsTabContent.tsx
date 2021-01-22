import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { useTranslatableContext, Record } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';
import { Labeled } from '../input';

/**
 * Default container for a group of translatable fields inside a TranslatableFields components.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabContent = (
    props: TranslatableFieldsTabContentProps
): ReactElement => {
    const { basePath, children, locale, record, resource, ...other } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();
    const classes = useStyles(props);

    return (
        <div
            role="tabpanel"
            hidden={selectedLocale !== locale}
            id={`translatable-content-${locale}`}
            aria-labelledby={`translatable-header-${locale}`}
            className={classes.root}
            {...other}
        >
            {Children.map(children, field =>
                isValidElement(field) && field.props.addLabel ? (
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
                            source: getSource(field.props.source, locale),
                        })}
                    </Labeled>
                ) : typeof field === 'string' ? (
                    field
                ) : (
                    isValidElement(field) &&
                    cloneElement(field, {
                        ...field.props,
                        label: getLabel(field.props.source),
                        source: getSource(field.props.source, locale),
                    })
                )
            )}
        </div>
    );
};

export type TranslatableFieldsTabContentProps = {
    basePath: string;
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    formGroupKeyPrefix?: string;
    locale: string;
    record: Record;
    resource: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
    },
}));
