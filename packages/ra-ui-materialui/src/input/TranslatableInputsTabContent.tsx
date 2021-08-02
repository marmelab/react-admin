import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import {
    FormGroupContextProvider,
    Record,
    useRecordContext,
    useTranslatableContext,
} from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';
import { FormInput } from '../form';
import { useResourceContext } from 'ra-core';

/**
 * Default container for a group of translatable inputs inside a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabContent = (
    props: TranslatableInputsTabContentProps
): ReactElement => {
    const {
        basePath,
        children,
        groupKey = '',
        locale,
        margin,
        variant,
        ...other
    } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();
    const classes = useStyles(props);
    const record = useRecordContext(props);
    const resource = useResourceContext(props);

    return (
        <FormGroupContextProvider name={`${groupKey}${locale}`}>
            <div
                role="tabpanel"
                hidden={selectedLocale !== locale}
                id={`translatable-content-${groupKey}${locale}`}
                aria-labelledby={`translatable-header-${groupKey}${locale}`}
                className={classes.root}
                {...other}
            >
                {Children.map(children, child =>
                    isValidElement(child) ? (
                        <FormInput
                            basePath={basePath}
                            input={cloneElement(child, {
                                ...child.props,
                                label: getLabel(
                                    child.props.source,
                                    child.props.label
                                ),
                                source: getSource(child.props.source, locale),
                            })}
                            record={record}
                            resource={resource}
                            variant={child.props.variant || variant}
                            margin={child.props.margin || margin}
                        />
                    ) : null
                )}
            </div>
        </FormGroupContextProvider>
    );
};

export type TranslatableInputsTabContentProps<
    RecordType extends Record | Omit<Record, 'id'> = Record
> = {
    basePath?: string;
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    groupKey?: string;
    locale: string;
    record?: RecordType;
    resource?: string;
    margin?: 'none' | 'normal' | 'dense';
    variant?: 'standard' | 'outlined' | 'filled';
};

const useStyles = makeStyles(
    theme => ({
        root: {
            flexGrow: 1,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            borderRadius: 0,
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            borderTop: 0,
        },
    }),
    { name: 'RaTranslatableInputsTabContent' }
);
