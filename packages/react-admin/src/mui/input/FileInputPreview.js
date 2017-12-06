import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    removeButtonHovered: {
        opacity: 1,
    },
    removeIcon: {
        color: theme.palette.accent1Color,
    },
    removeStyle: {
        display: 'inline-block',
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
            classes = {},
            className,
            onRemove,
            itemStyle,
        } = this.props;

        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                style={itemStyle}
                className={className}
            >
                <IconButton
                    className={classNames(
                        classes.removeButtonHovered,
                        this.state.hovered ? classes.removeStyle : ''
                    )}
                    onClick={onRemove}
                >
                    <RemoveCircle className={classes.removeIcon} />
                </IconButton>
                {children}
            </div>
        );
    }
}

FileInputPreview.propTypes = {
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    file: PropTypes.object,
    onRemove: PropTypes.func.isRequired,
    itemStyle: PropTypes.object,
    revokeObjectUrl: PropTypes.func,
};

FileInputPreview.defaultProps = {
    file: undefined,
    itemStyle: {},
};

export default withStyles(styles)(FileInputPreview);
