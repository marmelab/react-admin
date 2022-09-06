import * as React from 'react';

import { Configurable } from '../../configurable';
import {
    SimpleListConfigurable,
    SimpleListProps,
} from './SimpleListConfigurable';
import { SimpleListEditor } from './SimpleListEditor';

/**
 * The <SimpleList> component renders a list of records as a MUI <List>.
 * It is usually used as a child of react-admin's <List> and <ReferenceManyField> components.
 *
 * Also widely used on Mobile.
 *
 * Props:
 * - primaryText: function returning a React element (or some text) based on the record
 * - secondaryText: same
 * - tertiaryText: same
 * - leftAvatar: function returning a React element based on the record
 * - leftIcon: same
 * - rightAvatar: same
 * - rightIcon: same
 * - linkType: 'edit' or 'show', or a function returning 'edit' or 'show' based on the record
 * - rowStyle: function returning a style object based on (record, index)
 *
 * @example // Display all posts as a List
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <SimpleList
 *             primaryText={record => record.title}
 *             secondaryText={record => `${record.views} views`}
 *             tertiaryText={record =>
 *                 new Date(record.published_at).toLocaleDateString()
 *             }
 *             rowStyle={postRowStyle}
 *          />
 *     </List>
 * );
 */
export const SimpleList = ({ preferencesKey, ...props }: SimpleListProps) => (
    <Configurable
        editor={<SimpleListEditor resource={props.resource} />}
        preferencesKey={preferencesKey}
    >
        <SimpleListConfigurable {...props} />
    </Configurable>
);

SimpleList.propTypes = SimpleListConfigurable.propTypes;
