import { FunctionComponent, ReactNode, ReactElement } from 'react';
import { Record } from '../../types';
import useReference, { UseReferenceProps } from './useReference';


interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: UseReferenceProps) => ReactNode;
    record?: Record;
    reference: string;
    resource: string;
    source: string;
    linkType: string | boolean;
}

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
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
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export const ReferenceFieldController: FunctionComponent<Props> = ({
    children,
    ...props
}) => {
    return children(useReference(props)) as ReactElement<any>;
};

export default ReferenceFieldController;
