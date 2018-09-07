import React, { Children, Fragment, cloneElement } from 'react';
import PropTypes from 'prop-types';

const sanitizeRestProps = ({
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    saving,
    submitOnEnter,
    ...rest
}) => rest;

/**
 * This component ensure form related props are not passed to its children. This is required
 * in `NodeActions` is used inside a NodeForm and buttons not related to form (such as EditButton
 * or DeleteButton) are used.
 *
 * @example
 * const CustomNodeActions = props => (
 *     <NodeActions {...props}>
 *         <SaveButton variant="flat" />
 *         <IgnoreFormProps>
 *             <EditButton />
 *             <ShowButton />
 *             <DeleteButton />
 *         </IgnoreFormProps>
 *     </NodeActions>
 * );
 */
const IgnoreFormProps = ({ children, ...props }) => (
    <Fragment>
        {Children.map(children, child =>
            cloneElement(child, sanitizeRestProps(props))
        )}
    </Fragment>
);

IgnoreFormProps.propTypes = {
    children: PropTypes.node.isRequired,
};

export default IgnoreFormProps;
