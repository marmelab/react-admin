import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import getDefaultValues from './getDefaultValues';
import FormInput from './FormInput';
import Toolbar from './Toolbar';
import SanitizedForm from './SanitizedForm';

const styles = theme => ({
    form: {
        [theme.breakpoints.up('sm')]: {
            padding: '0 1em 1em 1em',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '0 1em 5em 1em',
        },
    },
});

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit((values, ...otherArgs) =>
            this.props.save(values, redirect, ...otherArgs)
        );

    render() {
        const {
            as: As = SanitizedForm,
            basePath,
            children,
            classes = {},
            className,
            invalid,
            record,
            resource,
            submitOnEnter,
            toolbar,
            version,
            ...rest
        } = this.props;

        return (
            <As
                className={classnames('simple-form', className)}
                resource={resource}
                invalid={invalid}
                {...rest}
            >
                <div className={classes.form} key={version}>
                    {Children.map(children, input => (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                        />
                    ))}
                </div>
                {toolbar &&
                    React.cloneElement(toolbar, {
                        handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                        invalid,
                        submitOnEnter,
                    })}
            </As>
        );
    }
}

SimpleForm.propTypes = {
    as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
    version: PropTypes.number,
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(SimpleForm);
