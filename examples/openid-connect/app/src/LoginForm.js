import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { userLogin as userLoginAction } from 'react-admin';

import { withStyles, createStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = ({ spacing }) =>
    createStyles({
        button: {
            width: '100%',
        },
        icon: {
            marginRight: spacing.unit,
        },
    });

const LoginForm = ({ classes, userLogin }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // If code is present, we came back from the provider
        if (code && state) {
            setLoading(true);
            userLogin({ code, state });
        }
    }, [userLogin]);

    const handleLogin = () => {
        setLoading(true);
        userLogin(); // Do not provide code, just trigger the redirection
    };

    return (
        <div>
            <CardActions>
                <Button
                    className={classes.button}
                    variant="raised"
                    type="submit"
                    color="primary"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading && (
                        <CircularProgress
                            className={classes.icon}
                            size={18}
                            thickness={2}
                        />
                    )}
                    Login With Google
                </Button>
            </CardActions>
        </div>
    );
}

const mapDispatchToProps = {
    userLogin: userLoginAction,
}

export default connect(undefined, mapDispatchToProps)(withStyles(styles)(LoginForm));
