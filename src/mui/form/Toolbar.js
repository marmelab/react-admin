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

const Toolbar = ({ invalid, submitOnEnter, handleSubmit, onSubmit, children }) => (
    <Responsive
        small={
            <MuiToolbar style={styles.mobileToolbar} noGutter>
                <ToolbarGroup>
                    {React.Children.map(children, button => (
                            React.cloneElement(button, { invalid, submitOnEnter, handleSubmit, onSubmit, raised: false })
                        ),
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
        medium={
            <MuiToolbar>
                <ToolbarGroup>
                    {React.Children.map(children, button => (
                            React.cloneElement(button, { invalid, submitOnEnter, handleSubmit, onSubmit })
                        ),
                    )}
                </ToolbarGroup>
            </MuiToolbar>
        }
    />
);

Toolbar.propTypes = {
    invalid: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    children: PropTypes.node,
    submitOnEnter: PropTypes.bool,
};

Toolbar.defaultProps = {
    submitOnEnter: true,
    children: [<SaveButton />],
}

export default Toolbar;
