import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ContentSave from 'material-ui-icons/Save';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import translate from '../../i18n/translate';

const styles = {
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

export class SaveButton extends Component {
    handleClick = e => {
        if (this.props.saving) {
            // prevent double submission
            e.preventDefault();
        } else {
            // always submit form explicitly regardless of button type
            const { handleSubmitWithRedirect, redirect } = this.props;
            if (e) {
                e.preventDefault();
            }
            handleSubmitWithRedirect(redirect)();
        }
    };

    render() {
        const {
            className,
            classes = {},
            saving,
            label = 'ra.action.save',
            invalid,
            raised = true,
            translate,
            handleSubmitWithRedirect,
            submitOnEnter,
            redirect,
            ...rest
        } = this.props;
        const type = submitOnEnter ? 'submit' : 'button';
        return (
            <Button
                className={classnames(classes.button, className)}
                raised={raised}
                type={type}
                onClick={this.handleClick}
                color={saving ? 'default' : 'primary'}
                {...rest}
            >
                {saving && saving.redirect === redirect ? (
                    <CircularProgress
                        size={25}
                        thickness={2}
                        className={classes.iconPaddingStyle}
                    />
                ) : (
                    <ContentSave className={classes.iconPaddingStyle} />
                )}
                {label && translate(label)}
            </Button>
        );
    }
}

SaveButton.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    handleSubmitWithRedirect: PropTypes.func,
    label: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    invalid: PropTypes.bool,
    raised: PropTypes.bool,
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
    translate: PropTypes.func.isRequired,
};

SaveButton.defaultProps = {
    redirect: 'list',
    handleSubmitWithRedirect: () => () => {},
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

const enhance = compose(
    translate,
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withStyles(styles)
);

export default enhance(SaveButton);
