import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    removeButton: {},
    removeIcon: {
        color: theme.palette.accent1Color,
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
            ...rest
        } = this.props;

        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                className={className}
                {...rest}
            >
                <IconButton className={classes.removeButton} onClick={onRemove}>
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
    revokeObjectUrl: PropTypes.func,
};

FileInputPreview.defaultProps = {
    file: undefined,
};

export default withStyles(styles)(FileInputPreview);
