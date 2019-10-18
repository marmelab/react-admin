import React, {
    Children,
    Component,
    isValidElement,
    cloneElement,
} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Record } from 'ra-core';

interface Props {
    basePath: string;
    parentSource: string;
    positionSource: string;
    record: Record;
    resource: string;
}

class TreeNodeActionsMenu extends Component<Props> {
    state = { anchorEl: null };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const {
            basePath,
            children,
            parentSource,
            positionSource,
            record,
            resource,
            ...props
        } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    {...props}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    marginThreshold={32}
                >
                    {Children.map(children, child =>
                        isValidElement(child)
                            ? cloneElement<any>(child, {
                                  basePath,
                                  parentSource,
                                  positionSource,
                                  record,
                                  resource,
                                  ...child.props,
                              })
                            : null
                    )}
                </Menu>
            </>
        );
    }
}

export default TreeNodeActionsMenu;
