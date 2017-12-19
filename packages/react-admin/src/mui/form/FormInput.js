import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import Labeled from '../input/Labeled';

const styles = theme => ({
    input: { width: theme.spacing.unit * 32 },
});

export const FormInput = ({ className, classes = {}, input, ...rest }) =>
    input ? (
        input.props.addLabel ? (
            <Labeled
                className={classnames(
                    'ra-input',
                    `ra-input-${input.props.source}`,
                    className
                )}
                {...input.props}
                {...rest}
            >
                {input}
            </Labeled>
        ) : (
            React.cloneElement(input, {
                className: classnames(
                    'ra-input',
                    `ra-input-${input.props.source}`,
                    className
                ),
                classes: { root: classes.input },
                ...rest,
            })
        )
    ) : null;

FormInput.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    input: PropTypes.object,
};

export default withStyles(styles)(FormInput);
