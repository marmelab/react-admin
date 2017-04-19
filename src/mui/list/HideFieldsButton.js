import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Visibility from 'material-ui/svg-icons/action/visibility';

class HideFieldsButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        return this.props.fields.length > 0 ?
            <div style={{ display: 'inline-block' }}>
                <FlatButton primary onTouchTap={this.handleTouchTap} label="Hide fields" icon={<Visibility />} />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}

                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                >
                    <List>
                        { this.props.fields.map((field, index) => <ListItem
                            key={index}
                            leftCheckbox={<Checkbox
                                defaultChecked={this.props.hiddenFields.indexOf(field.source) === -1}
                                onCheck={() => this.props.handleFieldVisibility(field.source)}
                                checkedIcon={<Visibility />}
                                uncheckedIcon={<VisibilityOff />}
                            />}
                            primaryText={field.title}
                        />)}
                    </List>
                </Popover>
            </div>
            : null;
    }
}

HideFieldsButton.defaultProps = {
    fields: [],
};

HideFieldsButton.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.shape({
        title: React.PropTypes.string,
        source: React.PropTypes.string,
    })),
    hiddenFields: React.PropTypes.arrayOf(React.PropTypes.string),
    handleFieldVisibility: React.PropTypes.func.isRequired,
};

export default HideFieldsButton;
