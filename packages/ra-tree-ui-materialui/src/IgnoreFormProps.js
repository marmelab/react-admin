import React, { Children, Fragment, cloneElement } from 'react';

const sanitizeRestProps = ({
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    saving,
    submitOnEnter,
    ...rest
}) => rest;

const IgnoreFormProps = ({ children, ...props }) => (
    <Fragment>
        {Children.map(children, child =>
            cloneElement(child, sanitizeRestProps(props))
        )}
    </Fragment>
);

export default IgnoreFormProps;
