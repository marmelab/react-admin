import React, { Fragment, useState } from 'react';
import { List, EditButton } from 'react-admin';
import {
    List as MuiList,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Collapse,
    Card,
    makeStyles,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
    card: {
        maxWidth: '20em',
        marginTop: '1em',
    },
});
const SmallCard = ({ className, ...props }) => {
    const classes = useStyles();
    return <Card {...props} className={`${className} ${classes.card}`} />;
};

const SubTree = ({ level, root, getChildNodes, openChildren, toggleNode }) => {
    const childNodes = getChildNodes(root);
    const hasChildren = childNodes.length > 0;
    const open = openChildren.includes(root.id);
    return (
        <Fragment>
            <ListItem
                button={hasChildren}
                onClick={() => hasChildren && toggleNode(root)}
                style={{ paddingLeft: level * 16 }}
            >
                {hasChildren && open && <ExpandLess />}
                {hasChildren && !open && <ExpandMore />}
                {!hasChildren && <div style={{ width: 24 }}>&nbsp;</div>}
                <ListItemText primary={root.name} />

                <ListItemSecondaryAction>
                    <EditButton record={root} basePath="/tags" />
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <MuiList component="div" disablePadding>
                    {childNodes.map(node => (
                        <SubTree
                            key={node.id}
                            root={node}
                            getChildNodes={getChildNodes}
                            openChildren={openChildren}
                            toggleNode={toggleNode}
                            level={level + 1}
                        />
                    ))}
                </MuiList>
            </Collapse>
        </Fragment>
    );
};

const Tree = ({ ids, data }) => {
    const [openChildren, setOpenChildren] = useState([]);
    const toggleNode = node =>
        setOpenChildren(state => {
            if (state.includes(node.id)) {
                return [
                    ...state.splice(0, state.indexOf(node.id)),
                    ...state.splice(state.indexOf(node.id) + 1, state.length),
                ];
            } else {
                return [...state, node.id];
            }
        });
    const nodes = ids.map(id => data[id]);
    const roots = nodes.filter(node => typeof node.parent_id === 'undefined');
    const getChildNodes = root =>
        nodes.filter(node => node.parent_id === root.id);
    return (
        <MuiList>
            {roots.map(root => (
                <SubTree
                    key={root.id}
                    root={root}
                    getChildNodes={getChildNodes}
                    openChildren={openChildren}
                    toggleNode={toggleNode}
                    level={1}
                />
            ))}
        </MuiList>
    );
};

const TagList = props => (
    <List
        {...props}
        perPage={1000}
        pagination={null}
        component={SmallCard}
        actions={null}
    >
        <Tree />
    </List>
);

export default TagList;
