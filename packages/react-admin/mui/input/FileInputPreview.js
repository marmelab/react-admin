import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import muiThemeable from 'material-ui/styles/muiThemeable';

const getStyles = ({ palette: { accent1Color } }) => ({
    removeButtonHovered: {
        opacity: 1,
    },
    removeIcon: {
        color: accent1Color,
    },
});

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
        const {
            children,
            onRemove,
            itemStyle,
            removeStyle,
            muiTheme,
        } = this.props;
        const styles = getStyles(muiTheme);
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
                    <RemoveCircle
                        style={styles.removeIcon}
                        color={muiTheme.palette.accent1Color}
                    />
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
    muiTheme: PropTypes.object.isRequired,
};

FileInputPreview.defaultProps = {
    file: undefined,
    itemStyle: {},
    removeStyle: { display: 'inline-block' },
};

export default muiThemeable()(FileInputPreview);
