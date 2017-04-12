import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import translate from '../../i18n/translate';

class SaveButton extends Component {

    handleClick = (e) => {
        if (this.props.saving) {
            // prevent double submission
            e.preventDefault();
        }
    }

    render() {
        const { saving, label = 'aor.action.save', raised = true, translate } = this.props;
        return raised
            ? <RaisedButton
                type="submit"
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
                type="submit"
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
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

export default connect(mapStateToProps)(translate(SaveButton));
