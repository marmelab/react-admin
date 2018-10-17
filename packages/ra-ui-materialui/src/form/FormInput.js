import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Labeled from '../input/Labeled';

const sanitizeRestProps = ({ basePath, record, ...rest }) => rest;

const styles = theme => ({
    input: { width: theme.spacing.unit * 32 },
});

export const FormInput = ({ classes, input, ...rest }) =>
    input ? (
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

FormInput.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    input: PropTypes.object,
};

// wat? TypeScript looses the displayName if we don't set it explicitly
FormInput.displayName = 'FormInput';

export default withStyles(styles)(FormInput);
