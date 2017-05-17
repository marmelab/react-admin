import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
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
        } else if (!this.props.submitOnEnter) {
            // explicit submission of the form needed because button type is 'button', not 'submit'
            this.props.submit();
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
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

const mapDispatchToProps = ({ submit: () => submit('record-form') });

export default connect(mapStateToProps, mapDispatchToProps)(translate(SaveButton));
