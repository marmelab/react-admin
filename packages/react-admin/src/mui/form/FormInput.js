import React from 'react';
import { withStyles } from 'material-ui/styles';
import Labeled from '../input/Labeled';

const styles = {
    input: { width: 256 },
};

export const FormInput = ({ classes, input, ...rest }) =>
    input ? (
        <div
            className={`ra-input ra-input-${input.props.source}`}
            style={input.props.style}
        >
            {input.props.addLabel ? (
                <Labeled {...input.props} {...rest}>
                    {input}
                </Labeled>
            ) : (
                React.cloneElement(input, {
                    classes: { root: classes.input },
                    ...rest,
                })
            )}
        </div>
    ) : null;

export default withStyles(styles)(FormInput);
