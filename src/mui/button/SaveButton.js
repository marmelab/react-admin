import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';

class SaveButton extends Component {

    handleClick = (e) => {
        if (this.props.saving) {
            // prevent double submission
            e.preventDefault();
        }
    }

    render() {
        const { saving } = this.props;
        return <RaisedButton
            type="submit"
            label="Save"
            icon={saving ? <CircularProgress size={25} thickness={2} /> : <ContentSave />}
            onClick={this.handleClick}
            primary={!saving}
            style={{
                margin: '10px 24px',
                position: 'relative',
            }}
        />;
    }
}

SaveButton.propTypes = {
    saving: PropTypes.bool,
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

export default connect(mapStateToProps)(SaveButton);
