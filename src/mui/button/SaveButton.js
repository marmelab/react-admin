import React, { Component } from 'react';
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

    handleClick = (e) => {
        if (this.state.submitting) {
            // prevent double submission
            e.preventDefault();
        }
        this.setState({ submitting: true });
    }

    render() {
        return <RaisedButton
            type="submit"
            label="Save"
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

export default SaveButton;
