import { ReactNode, ReactElement } from 'react';
import get from 'lodash/get';

import { Record } from '../../types';

import getResourceLinkPath, { LinkToFunctionType } from './getResourceLinkPath';
import useReference, { UseReferenceProps } from '../useReference';

interface ChildrenParams extends UseReferenceProps {
    resourceLinkPath: string | false;
}

export interface ReferenceFieldControllerProps {
    basePath: string;
    children: (params: ChildrenParams) => ReactNode;
    record?: Record;
    reference: string;
    resource: string;
    source: string;
    link?: string | boolean | LinkToFunctionType;
    label?: string;
}

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the link prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" link="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `link` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" link={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export const ReferenceFieldController = (
    props: ReferenceFieldControllerProps
) => {
    const { children, record, source, ...rest } = props;
    const id = get(record, source);
    return children({
        ...useReference({ ...rest, id }),
        resourceLinkPath: getResourceLinkPath({ ...rest, record, source }),
    }) as ReactElement<any>;
};

export default ReferenceFieldController;
