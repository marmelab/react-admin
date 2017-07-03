import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { pinkA200 } from 'material-ui/styles/colors';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';

const styles = {
    removeButtonHovered: {
        opacity: 1,
    },
};

export class FileInputPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false,
        };
    }

    componentWillUnmount() {
        const { file } = this.props;

        if (file.preview) {
            window.URL.revokeObjectURL(file.preview);
        }
    }

    handleMouseOut = () => this.setState({ hovered: false });
    handleMouseOver = () => this.setState({ hovered: true });

    render() {
        const { children, onRemove, itemStyle, removeStyle } = this.props;

        const removeButtonStyle = this.state.hovered
            ? {
                  ...removeStyle,
                  ...styles.removeButtonHovered,
              }
            : removeStyle;

        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                style={itemStyle}
            >
                <IconButton style={removeButtonStyle} onClick={onRemove}>
                    <RemoveCircle color={pinkA200} />
                </IconButton>
                {children}
            </div>
        );
    }
}

FileInputPreview.propTypes = {
    children: PropTypes.element.isRequired,
    file: PropTypes.object,
    onRemove: PropTypes.func.isRequired,
    itemStyle: PropTypes.object,
    removeStyle: PropTypes.object,
};

FileInputPreview.defaultProps = {
    file: undefined,
    itemStyle: {},
    removeStyle: { display: 'inline-block' },
};

export default FileInputPreview;
