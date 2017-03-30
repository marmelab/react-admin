import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import translate from '../../i18n/translate';

export class SaveButton extends Component {

    handleClick = (e) => {
        if (this.props.saving) {
            // prevent double submission
            e.preventDefault();
        } else if (!this.props.submitOnEnter && this.props.handleSubmit) {
            this.props.handleSubmit();
        }
    }

    render() {
        const { saving, label = 'aor.action.save', raised = true, translate, submitOnEnter } = this.props;
        const type = submitOnEnter ? 'submit' : 'button';
        return raised
            ? <RaisedButton
                type={type}
                label={label && translate(label)}
                icon={saving ? <CircularProgress size={25} thickness={2} /> : <ContentSave />}
                onClick={this.handleClick}
                primary={!saving}
                style={{
                    margin: '10px 24px',
                    position: 'relative',
                }}
            />
            : <FlatButton
                type={type}
                label={label && translate(label)}
                icon={saving ? <CircularProgress size={25} thickness={2} /> : <ContentSave />}
                onClick={this.handleClick}
                primary={!saving}
                style={{
                    margin: '10px 24px',
                    position: 'relative',
                }}
            />
        ;
    }
}

SaveButton.propTypes = {
    label: PropTypes.string,
    raised: PropTypes.bool,
    saving: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    submitOnEnter: PropTypes.bool,
    handleSubmit: PropTypes.func,
};

SaveButton.defaultProps = {
    submitOnEnter: true,
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

export default connect(mapStateToProps)(translate(SaveButton));
