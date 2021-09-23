import * as React from 'react';
import {
    Children,
    cloneElement,
    MouseEvent,
    MouseEventHandler,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Record } from 'ra-core';

import { ClassesOverride } from '../../types';
import FormInput from '../../form/FormInput';
import { useSimpleFormIteratorStyles } from './useSimpleFormIteratorStyles';
import { ArrayInputContextValue } from './ArrayInputContext';

export const SimpleFormIteratorItem = (props: SimpleFormIteratorItemProps) => {
    const {
        basePath,
        children,
        classes,
        disabled,
        disableReordering,
        disableRemove,
        fields,
        getItemLabel,
        index,
        margin,
        member,
        onRemoveField,
        onReorder,
        record,
        removeButton,
        reOrderButtons,
        resource,
        source,
        variant,
    } = props;

    // Returns a boolean to indicate whether to disable the remove button for certain fields.
    // If disableRemove is a function, then call the function with the current record to
    // determining if the button should be disabled. Otherwise, use a boolean property that
    // enables or disables the button for all of the fields.
    const disableRemoveField = (record: Record) => {
        if (typeof disableRemove === 'boolean') {
            return disableRemove;
        }
        return disableRemove && disableRemove(record);
    };

    // remove field and call the onClick event of the button passed as removeButton prop
    const handleRemoveButtonClick = (
        originalOnClickHandler: MouseEventHandler,
        index: number
    ) => (event: MouseEvent) => {
        onRemoveField(index);
        if (originalOnClickHandler) {
            originalOnClickHandler(event);
        }
    };

    return (
        <li className={classes.line}>
            <div>
                <div className={classes.indexContainer}>
                    <Typography variant="body1" className={classes.index}>
                        {getItemLabel(index)}
                    </Typography>
                    {!disabled &&
                        !disableReordering &&
                        cloneElement(reOrderButtons, {
                            index,
                            max: fields.length,
                            onReorder,
                            className: classNames(
                                'button-reorder',
                                `button-reorder-${source}-${index}`
                            ),
                        })}
                </div>
            </div>
            <section className={classes.form}>
                {Children.map(children, (input: ReactElement, index2) => {
                    if (!isValidElement<any>(input)) {
                        return null;
                    }
                    const { source, ...inputProps } = input.props;
                    return (
                        <FormInput
                            basePath={input.props.basePath || basePath}
                            input={cloneElement(input, {
                                source: source ? `${member}.${source}` : member,
                                index: source ? undefined : index2,
                                label:
                                    typeof input.props.label === 'undefined'
                                        ? source
                                            ? `resources.${resource}.fields.${source}`
                                            : undefined
                                        : input.props.label,
                                disabled,
                                ...inputProps,
                            })}
                            record={record}
                            resource={resource}
                            variant={variant}
                            margin={margin}
                        />
                    );
                })}
            </section>
            {!disabled && !disableRemoveField(record) && (
                <span className={classes.action}>
                    {cloneElement(removeButton, {
                        onClick: handleRemoveButtonClick(
                            removeButton.props.onClick,
                            index
                        ),
                        className: classNames(
                            'button-remove',
                            `button-remove-${source}-${index}`
                        ),
                    })}
                </span>
            )}
        </li>
    );
};

export type DisableRemoveFunction = (record: Record) => boolean;

export type SimpleFormIteratorItemProps = ArrayInputContextValue & {
    basePath: string;
    children?: ReactNode;
    classes?: ClassesOverride<typeof useSimpleFormIteratorStyles>;
    disabled?: boolean;
    disableRemove?: boolean | DisableRemoveFunction;
    disableReordering?: boolean;
    getItemLabel?: (index: number) => string;
    index: number;
    margin?: 'none' | 'normal' | 'dense';
    member: string;
    onRemoveField: (index: number) => void;
    onReorder: (origin: number, destination: number) => void;
    record: Record;
    removeButton?: ReactElement;
    reOrderButtons?: ReactElement;
    resource: string;
    source: string;
    variant?: 'standard' | 'outlined' | 'filled';
};
