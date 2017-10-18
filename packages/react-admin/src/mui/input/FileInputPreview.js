import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import { withTheme } from 'material-ui/styles';

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
        const { file, revokeObjectURL } = this.props;

        if (file.preview) {
            revokeObjectURL
                ? revokeObjectURL(file.preview)
                : window.URL.revokeObjectURL(file.preview);
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
            theme,
        } = this.props;
        const styles = getStyles(theme);
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
                        color={theme.palette.accent1Color}
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
    theme: PropTypes.object.isRequired,
    revokeObjectUrl: PropTypes.func,
};

FileInputPreview.defaultProps = {
    file: undefined,
    itemStyle: {},
    removeStyle: { display: 'inline-block' },
};

export default withTheme()(FileInputPreview);
