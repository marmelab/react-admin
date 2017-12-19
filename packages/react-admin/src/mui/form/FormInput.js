import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Labeled from '../input/Labeled';

export const FormInput = ({ className, input, ...rest }) =>
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
                ...rest,
            })
        )
    ) : null;

FormInput.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    input: PropTypes.object,
};

export default FormInput;
