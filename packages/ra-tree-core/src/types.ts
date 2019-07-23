import { Identifier, Record } from 'ra-core';

export interface TreeItem {
    id: Identifier;
    children: Identifier[];
    hasChildren: boolean;
    isExpanded: boolean;
    isChildrenLoading: boolean;
    data: Record;
}

export interface Tree {
    rootId: Identifier;
    items: { [key: string]: TreeItem };
}
