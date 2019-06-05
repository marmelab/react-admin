import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, createStyles } from '@material-ui/core/styles';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { translate } from 'ra-core';

const styles = theme =>
    createStyles({
        removeButton: {},
        removeIcon: {
            color: theme.palette.accent1Color,
        },
    });

export class FileInputPreview extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        classes: PropTypes.object,
        className: PropTypes.string,
        file: PropTypes.object,
        onRemove: PropTypes.func.isRequired,
        revokeObjectURL: PropTypes.func,
    };

    static defaultProps = {
        file: undefined,
        translate: id => id,
    };

    componentWillUnmount() {
        const { file, revokeObjectURL } = this.props;

        if (file.preview) {
            revokeObjectURL ? revokeObjectURL(file.preview) : window.URL.revokeObjectURL(file.preview);
        }
    }

    render() {
        const { children, classes = {}, className, onRemove, revokeObjectURL, file, translate, ...rest } = this.props;

        return (
            <div className={className} {...rest}>
                <IconButton className={classes.removeButton} onClick={onRemove} title={translate('ra.action.delete')}>
                    <RemoveCircle className={classes.removeIcon} />
                </IconButton>
                {children}
            </div>
        );
    }
}

export default compose(
    withStyles(styles),
    translate
)(FileInputPreview);
