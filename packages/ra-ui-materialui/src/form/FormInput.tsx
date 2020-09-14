import * as React from 'react';
import { FC, HtmlHTMLAttributes, ReactElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Record } from 'ra-core';

import Labeled from '../input/Labeled';
import { ClassesOverride } from '../types';

const sanitizeRestProps = ({ basePath, record, ...rest }) => rest;

const useStyles = makeStyles(
    theme => ({
        input: { width: theme.spacing(32) },
    }),
    { name: 'RaFormInput' }
);

const FormInput: FC<FormInputProps> = props => {
    const { input, classes: classesOverride, ...rest } = props;
    const classes = useStyles(props);
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
                    id={input.props.id || input.props.source}
                    {...input.props}
                    {...sanitizeRestProps(rest)}
                >
                    {React.cloneElement(input, {
                        className: classnames(
                            {
                                [classes.input]: !input.props.fullWidth,
                            },
                            input.props.className
                        ),
                        id: input.props.id || input.props.source,
                        ...rest,
                    })}
                </Labeled>
            ) : (
                React.cloneElement(input, {
                    className: classnames(
                        {
                            [classes.input]: !input.props.fullWidth,
                        },
                        input.props.className
                    ),
                    id: input.props.id || input.props.source,
                    ...rest,
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

export interface FormInputProps extends HtmlHTMLAttributes<HTMLDivElement> {
    basePath: string;
    classes?: ClassesOverride<typeof useStyles>;
    input: ReactElement;
    margin?: 'none' | 'normal' | 'dense';
    record: Record;
    resource: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

// wat? TypeScript looses the displayName if we don't set it explicitly
FormInput.displayName = 'FormInput';

export default FormInput;
