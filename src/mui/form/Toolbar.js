import React from 'react';
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

const Toolbar = ({ invalid, submitOnEnter = true }) => (
    <Responsive
        small={
            <MuiToolbar style={styles.mobileToolbar} noGutter>
                <ToolbarGroup>
                    <SaveButton invalid={invalid} submitOnEnter={submitOnEnter} raised={false} />
                </ToolbarGroup>
            </MuiToolbar>
        }
        medium={
            <MuiToolbar>
                <ToolbarGroup>
                    <SaveButton invalid={invalid} submitOnEnter={submitOnEnter} />
                </ToolbarGroup>
            </MuiToolbar>
        }
    />
);

export default Toolbar;
