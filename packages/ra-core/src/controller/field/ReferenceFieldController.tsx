import React, { SFC, ReactNode, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions';
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
    crudGetManyAccumulate: Dispatch<typeof crudGetManyAccumulateAction>;
    record?: Record;
    reference: string;
    referenceRecord?: Record;
    resource: string;
    source: string;
    linkType: string | boolean;
}

const fetchReference = (source, reference, crudGetManyAccumulate) => () => {
    if (source !== null && typeof source !== 'undefined') {
        crudGetManyAccumulate(reference, [source]);
    }
};

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
export const UnconnectedReferenceFieldController: SFC<Props> = ({
    allowEmpty = false,
    basePath,
    children,
    linkType = 'edit',
    record = { id: '' },
    reference,
    referenceRecord = null,
    resource,
    source,
    crudGetManyAccumulate,
}) => {
    const sourceValue = get(record, source);
    useEffect(fetchReference(sourceValue, reference, crudGetManyAccumulate), [
        sourceValue,
        reference,
        crudGetManyAccumulate,
    ]);
    const rootPath = basePath.replace(resource, reference);
    const resourceLinkPath = !linkType
        ? false
        : linkToRecord(rootPath, get(record, source), linkType as string);

    return children({
        isLoading: !referenceRecord && !allowEmpty,
        referenceRecord,
        resourceLinkPath,
    }) as ReactElement<any>;
};

const mapStateToProps = (state, props) => ({
    referenceRecord:
        state.admin.resources[props.reference] &&
        state.admin.resources[props.reference].data[
            get(props.record, props.source)
        ],
});

const ReferenceFieldController = connect(
    mapStateToProps,
    {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }
)(UnconnectedReferenceFieldController);

export default ReferenceFieldController;
