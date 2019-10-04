import React, {
    Children,
    cloneElement,
    ReactNode,
    isValidElement,
} from 'react';
import {
    withStyles,
    WithStyles,
    createStyles,
    Theme,
} from '@material-ui/core/styles';
import classnames from 'classnames';
import { Record } from 'ra-core';

interface Props {
    children: ReactNode;
    className?: string;
}
interface InjectedProps {
    basePath: string;
    record: Record;
}
const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginLeft: 'auto',
            paddingRight: theme.spacing.unit * 3,
        },
    });

const TreeNodeActions = withStyles(styles)(
    ({
        basePath,
        children,
        classes,
        className,
        record,
    }: Props & InjectedProps & WithStyles<typeof styles>) => (
        <div className={classnames(classes.root, className)}>
            {Children.map(children, child =>
                isValidElement(child)
                    ? cloneElement<any>(child, {
                          basePath,
                          record,
                          ...child.props,
                      })
                    : null
            )}
        </div>
    )
);

export default TreeNodeActions;
