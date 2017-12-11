import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ContentSave from 'material-ui-icons/Save';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';

const styles = {
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
            classes = {},
            saving,
            label = 'ra.action.save',
            raised = true,
            translate,
            submitOnEnter,
            redirect,
        } = this.props;
        const type = submitOnEnter ? 'submit' : 'button';
        return (
            <Button
                raised={raised}
                type={type}
                onClick={this.handleClick}
                color={saving ? 'default' : 'primary'}
                style={{
                    margin: '10px 24px',
                    position: 'relative',
                }}
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
    classes: PropTypes.object,
    handleSubmitWithRedirect: PropTypes.func,
    label: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
    connect(mapStateToProps),
    withStyles(styles),
    translate
);
export default enhance(SaveButton);
