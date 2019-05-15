import React, { SFC, ReactNode, useEffect, ReactElement } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate } from '../../actions';
import { linkToRecord } from '../../util';
import { Record, Dispatch, ReduxState } from '../../types';

interface ChildrenFuncParams {
    isLoading: boolean;
    referenceRecord: Record;
    resourceLinkPath: string | boolean;
}

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
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
export const ReferenceFieldController: SFC<Props> = ({
    allowEmpty = false,
    basePath,
    children,
    linkType = 'edit',
    record = { id: '' },
    reference,
    resource,
    source,
}) => {
    const sourceId = get(record, source);
    const referenceRecord = useSelector(
        getReferenceRecord(sourceId, reference)
    );
    const dispatch = useDispatch();
    useEffect(fetchReference(sourceId, reference, dispatch), [
        sourceId,
        reference,
    ]);
    const rootPath = basePath.replace(resource, reference);
    const resourceLinkPath = !linkType
        ? false
        : linkToRecord(rootPath, sourceId, linkType as string);

    return children({
        isLoading: !referenceRecord && !allowEmpty,
        referenceRecord,
        resourceLinkPath,
    }) as ReactElement<any>;
};

const getReferenceRecord = (sourceId, reference) => (state: ReduxState) =>
    state.admin.resources[reference] &&
    state.admin.resources[reference].data[sourceId];

const fetchReference = (sourceId, reference, dispatch) => () => {
    if (sourceId !== null && typeof sourceId !== 'undefined') {
        dispatch(crudGetManyAccumulate(reference, [sourceId]));
    }
};

export default ReferenceFieldController;
