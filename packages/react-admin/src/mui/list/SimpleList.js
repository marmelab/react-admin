import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import List, {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import linkToRecord from '../../util/linkToRecord';
import SimpleListSelectItem from './SimpleListSelectItem';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    tertiary: { float: 'right', opacity: 0.541176 },
};

const LinkOrNot = withStyles(styles)(
    ({ classes, linkType, basePath, id, children }) =>
        linkType === 'edit' || linkType === true ? (
            <Link to={linkToRecord(basePath, id)} className={classes.link}>
                {children}
            </Link>
        ) : linkType === 'show' ? (
            <Link
                to={`${linkToRecord(basePath, id)}/show`}
                className={classes.link}
            >
                {children}
            </Link>
        ) : (
            <span>{children}</span>
        )
);

class SimpleList extends React.Component {
    static defaultProps = {
        linkType: 'edit',
        selectItemLocation: 'primary',
    };

    static propTypes = {
        classes: PropTypes.object,
        className: PropTypes.string,
        ids: PropTypes.array,
        data: PropTypes.object,
        resource: PropTypes.string,
        selectable: PropTypes.bool,
        selection: PropTypes.array,
        selectItemLocation: PropTypes.oneOf(['primary', 'secondary']),
        selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']),
        basePath: PropTypes.string,
        primaryText: PropTypes.func,
        secondaryText: PropTypes.func,
        tertiaryText: PropTypes.func,
        leftAvatar: PropTypes.func,
        leftIcon: PropTypes.func,
        rightAvatar: PropTypes.func,
        rightIcon: PropTypes.func,
        linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
            .isRequired,
    };

    state = { selecting: false };
    activateSelecting = selecting => {
        this.setState({
            selecting,
        });
    };

    render() {
        const {
            classes = {},
            className,
            currentSort,
            isLoading,
            setSort,
            ids,
            data,
            basePath,
            primaryText,
            secondaryText,
            tertiaryText,
            leftAvatar,
            leftIcon,
            rightAvatar,
            rightIcon,
            linkType,
            resource,
            selectable,
            selectItemLocation,
            selectionMode,
            selection,
            ...rest
        } = this.props;
        return (
            <List className={className} {...rest}>
                {ids.map(id => (
                    <LinkOrNot
                        linkType={linkType}
                        basePath={basePath}
                        id={id}
                        key={id}
                    >
                        <ListItem button>
                            {leftIcon && (
                                <ListItemIcon>
                                    {leftIcon(data[id], id)}
                                </ListItemIcon>
                            )}
                            {leftAvatar && (
                                <ListItemAvatar>
                                    <Avatar>{leftAvatar(data[id], id)}</Avatar>
                                </ListItemAvatar>
                            )}
                            {selectable &&
                                selectItemLocation === 'primary' && (
                                    <SimpleListSelectItem
                                        selectionMode={selectionMode}
                                        selection={selection}
                                        record={data[id]}
                                        resource={resource}
                                    />
                                )}
                            <ListItemText
                                primary={
                                    <div>
                                        {primaryText(data[id], id)}
                                        {tertiaryText && (
                                            <span className={classes.tertiary}>
                                                {tertiaryText(data[id], id)}
                                            </span>
                                        )}
                                    </div>
                                }
                                secondary={
                                    secondaryText && secondaryText(data[id], id)
                                }
                            />
                            {(rightAvatar || rightIcon) && (
                                <ListItemSecondaryAction>
                                    {rightAvatar && (
                                        <Avatar>
                                            {rightAvatar(data[id], id)}
                                        </Avatar>
                                    )}
                                    {rightIcon && (
                                        <ListItemIcon>
                                            {rightIcon(data[id], id)}
                                        </ListItemIcon>
                                    )}
                                    {selectable &&
                                        selectItemLocation === 'secondary' && (
                                            <SimpleListSelectItem
                                                selectionMode={selectionMode}
                                                selection={selection}
                                                record={data[id]}
                                                resource={resource}
                                            />
                                        )}
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    </LinkOrNot>
                ))}
            </List>
        );
    }
}

export default withStyles(styles)(SimpleList);
