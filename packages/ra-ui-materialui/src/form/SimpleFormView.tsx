import * as React from 'react';
import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormWithRedirectRenderProps, MutationMode, RaRecord } from 'ra-core';
import { CardContentInner } from '../layout';
import { Toolbar } from './Toolbar';
import { FormInput } from './FormInput';

export const SimpleFormView = ({
    children,
    className,
    component: Component = CardContentInner,
    handleSubmit,
    margin,
    mutationMode,
    record,
    resource,
    saving,
    submitOnEnter = true,
    toolbar = DefaultToolbar,
    variant,
    ...rest
}: SimpleFormViewProps): ReactElement => (
    <form
        className={classnames('simple-form', className)}
        onSubmit={handleSubmit}
        {...sanitizeRestProps(rest)}
    >
        <Component>
            {Children.map(
                children,
                (input: ReactElement) =>
                    input && (
                        <FormInput
                            input={input}
                            record={record}
                            resource={resource}
                            variant={input.props.variant || variant}
                            margin={input.props.margin || margin}
                        />
                    )
            )}
        </Component>
        {toolbar &&
            cloneElement(toolbar, {
                className: 'toolbar',
                mutationMode,
                record,
                resource,
                saving,
                submitOnEnter,
            })}
    </form>
);

SimpleFormView.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    invalid: PropTypes.bool,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([false])]),
    validate: PropTypes.func,
};

const DefaultToolbar = <Toolbar />;

export interface SimpleFormViewProps extends FormWithRedirectRenderProps {
    children?: ReactNode;
    className?: string;
    component?: React.ComponentType<any>;
    margin?: 'none' | 'normal' | 'dense';
    mutationMode?: MutationMode;
    record?: Partial<RaRecord>;
    resource?: string;
    toolbar?: ReactElement | false;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
}

const sanitizeRestProps = ({ save = null, ...props }) => props;
