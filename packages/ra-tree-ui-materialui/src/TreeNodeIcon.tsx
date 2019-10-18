import React, { SFC, ComponentType, MouseEvent } from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme } from '@material-ui/core';
import { StyleRules, withStyles, WithStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { withTranslate, Translate } from 'ra-core';

interface Props {
    expanded: boolean;
    hasChildren: boolean;
    loading: boolean;
    onClick: (event: MouseEvent<HTMLElement>) => void;
}

interface InjectedProps {
    translate: Translate;
}

const TreeNodeIconView: SFC<
    Props & InjectedProps & WithStyles<typeof styles>
> = ({ classes, expanded, hasChildren, loading, onClick, translate }) => {
    return (
        <ListItemIcon>
            {loading ? (
                <div className={classes.icon}>
                    <CircularProgress size="1em" />
                </div>
            ) : hasChildren ? (
                <IconButton
                    className={classes.button}
                    aria-label={translate(
                        expanded ? 'ra.tree.close' : 'ra.tree.expand'
                    )}
                    title={translate(
                        expanded ? 'ra.tree.close' : 'ra.tree.expand'
                    )}
                    onClick={onClick}
                >
                    {expanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </IconButton>
            ) : (
                <KeyboardArrowRight className={classes.invisible} />
            )}
        </ListItemIcon>
    );
};

const styles = (theme: Theme): StyleRules => ({
    button: {
        height: theme.spacing.unit * 3,
        width: theme.spacing.unit * 3,
    },
    icon: {
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        fontSize: '1.5rem',
        height: theme.spacing.unit * 3,
        justifyContent: 'baseline',
        position: 'relative',
        verticalAlign: 'middle',
        width: theme.spacing.unit * 3,
    },
    invisible: {
        opacity: 0,
    },
});

const TreeNodeIcon = compose(
    withStyles(styles),
    withTranslate
)(TreeNodeIconView) as ComponentType<Props>;

export default TreeNodeIcon;
