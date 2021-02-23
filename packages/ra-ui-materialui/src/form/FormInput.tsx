import * as React from 'react';
import { HtmlHTMLAttributes, ReactElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Record } from 'ra-core';

import Labeled from '../input/Labeled';
import { ClassesOverride } from '../types';

const sanitizeRestProps = ({
    basePath,
    record,
    ...rest
}: {
    basePath?: string;
    record?: unknown;
}) => rest;

const useStyles = makeStyles(
    theme => ({
        input: { width: theme.spacing(32) },
    }),
    { name: 'RaFormInput' }
);

const FormInput = <RecordType extends Record | Omit<Record, 'id'> = Record>(
    props: FormInputProps<RecordType>
) => {
    const { input, classes: classesOverride, ...rest } = props;
    const classes = useStyles(props);
    const { id, className, ...inputProps } = input
        ? input.props
        : { id: undefined, className: undefined };
    return input ? (
        <div
            className={classnames(
                'ra-input',
                `ra-input-${input.props.source}`,
                input.props.formClassName
            )}
        >
            {input.props.addLabel ? (
                <Labeled
                    id={id || input.props.source}
                    {...inputProps}
                    {...sanitizeRestProps(rest)}
                >
                    {React.cloneElement(input, {
                        className: classnames(
                            {
                                [classes.input]: !input.props.fullWidth,
                            },
                            className
                        ),
                        id: input.props.id || input.props.source,
                        ...rest,
                        ...inputProps,
                    })}
                </Labeled>
            ) : (
                React.cloneElement(input, {
                    className: classnames(
                        {
                            [classes.input]: !input.props.fullWidth,
                        },
                        className
                    ),
                    id: input.props.id || input.props.source,
                    ...rest,
                    ...inputProps,
                })
            )}
        </div>
    ) : null;
};

FormInput.propTypes = {
    classes: PropTypes.object,
    // @ts-ignore
    input: PropTypes.node,
};

export interface FormInputProps<
    RecordType extends Record | Omit<Record, 'id'> = Record
> extends HtmlHTMLAttributes<HTMLDivElement> {
    basePath: string;
    classes?: ClassesOverride<typeof useStyles>;
    input: ReactElement<{
        label?: string;
        source?: string;
        id?: string;
        [key: string]: unknown;
    }>;
    margin?: 'none' | 'normal' | 'dense';
    record?: RecordType;
    resource?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

// What? TypeScript loses the displayName if we don't set it explicitly
FormInput.displayName = 'FormInput';

export default FormInput;
