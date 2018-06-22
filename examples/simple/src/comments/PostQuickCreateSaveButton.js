import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconSave from '@material-ui/icons/Save';
import withStyles from '@material-ui/core/styles/withStyles';

import { translate } from 'react-admin'; // eslint-disable-line import/no-unresolved

const styles = {
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

class SaveButtonView extends Component {
    static propTypes = {
        classes: PropTypes.object,
        handleSubmitWithRedirect: PropTypes.func,
        label: PropTypes.string,
        redirect: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.func,
        ]),
        saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        translate: PropTypes.func.isRequired,
    };

    handleClick = e => {
        const { handleSubmitWithRedirect, redirect, saving } = this.props;

        if (saving) {
            // prevent double submission
            e.preventDefault();
        } else {
            // always submit form explicitly regardless of button type
            if (e) {
                e.preventDefault();
            }
            handleSubmitWithRedirect(redirect)();
        }
    };

    render() {
        const {
            classes = {},
            label = 'ra.action.save',
            redirect,
            saving,
            translate,
        } = this.props;

        return (
            <Button
                className={classes.button}
                variant="raised"
                type="submit"
                onClick={this.handleClick}
                color={saving ? 'default' : 'primary'}
            >
                {saving && saving.redirect === redirect ? (
                    <CircularProgress
                        size={25}
                        thickness={2}
                        className={classes.iconPaddingStyle}
                    />
                ) : (
                    <IconSave className={classes.iconPaddingStyle} />
                )}
                {label && translate(label, { _: label })}
            </Button>
        );
    }
}

export default compose(translate, withStyles(styles))(SaveButtonView);
