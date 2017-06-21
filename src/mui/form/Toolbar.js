import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar as MuiToolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Responsive from '../layout/Responsive';
import { SaveButton } from '../button';

const styles = {
    mobileToolbar: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        zIndex: 2,
    },
};

const Toolbar = ({ invalid, submitOnEnter, submitWithRedirect, redirect, children }) => (
    <Responsive
        small={
            <MuiToolbar style={styles.mobileToolbar} noGutter>
                <ToolbarGroup>
                    {React.Children.map(children, button => (
                            React.cloneElement(button, { invalid, submitOnEnter, submitWithRedirect, redirect, raised: false, ...button.props })
                        ),
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
        medium={
            <MuiToolbar>
                <ToolbarGroup>
                    {React.Children.map(children, button => (
                            React.cloneElement(button, { invalid, submitOnEnter, submitWithRedirect, redirect, ...button.props })
                        ),
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
    />
);

Toolbar.propTypes = {
    invalid: PropTypes.bool,
    submitWithRedirect: PropTypes.func,
    children: PropTypes.node,
    submitOnEnter: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
};

Toolbar.defaultProps = {
    submitOnEnter: true,
    children: [<SaveButton />],
}

export default Toolbar;
