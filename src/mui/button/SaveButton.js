import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import translate from '../../i18n/translate';

export class SaveButton extends Component {
    handleClick = e => {
        if (this.props.saving || this.props.disabled) {
            // prevent double submission and deal with disabled button
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
            saving,
            label = 'aor.action.save',
            raised = true,
            translate,
            submitOnEnter,
            redirect,
            disabled,
        } = this.props;
        const type = submitOnEnter ? 'submit' : 'button';
        const ButtonComponent = raised ? RaisedButton : FlatButton;
        return (
            <ButtonComponent
                disabled={disabled}
                type={type}
                label={label && translate(label, { _: label })}
                icon={
                    saving && saving.redirect === redirect ? (
                        <CircularProgress size={25} thickness={2} />
                    ) : (
                        <ContentSave />
                    )
                }
                onClick={this.handleClick}
                primary={!saving}
                style={{
                    margin: '10px 24px',
                    position: 'relative',
                }}
            />
        );
    }
}

SaveButton.propTypes = {
    label: PropTypes.string,
    raised: PropTypes.bool,
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    translate: PropTypes.func.isRequired,
    submitOnEnter: PropTypes.bool,
    handleSubmitWithRedirect: PropTypes.func,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    disabled: PropTypes.bool,
};

SaveButton.defaultProps = {
    handleSubmitWithRedirect: () => () => {},
    disabled: false,
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

export default connect(mapStateToProps)(translate(SaveButton));
