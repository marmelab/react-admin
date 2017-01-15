import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentSave from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';

class SaveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.invalid) {
            this.setState({ submitting: false });
        }
    }

    handleClick = (e) => {
        if (this.state.submitting) {
            // prevent double submission
            e.preventDefault();
        }
        this.setState({ submitting: true });
    }

    render() {
        const { label = 'Save' } = this.props;
        return <RaisedButton
            type="submit"
            label={label}
            icon={this.state.submitting ? <CircularProgress size={25} thickness={2} /> : <ContentSave />}
            onClick={this.handleClick}
            primary={!this.state.submitting}
            style={{
                margin: '10px 24px',
                position: 'relative',
            }}
        />;
    }
}

SaveButton.propTypes = {
    invalid: PropTypes.bool,
    label: PropTypes.string,
};

export default SaveButton;
