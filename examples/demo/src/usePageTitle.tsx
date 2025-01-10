import {
    HintedString,
    RaRecord,
    useGetRecordRepresentation,
    useGetResourceLabel,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

export const usePageTitle = (props: {
    view: HintedString<'list' | 'edit' | 'show' | 'create'>;
    record?: RaRecord;
    resource?: string;
    count?: number;
}) => {
    const { view, count = view === 'list' ? 2 : 1 } = props;
    const translate = useTranslate();
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const getResourceLabel = useGetResourceLabel();
    const getRecordRepresentation = useGetRecordRepresentation();

    if (!resource) {
        throw new Error(
            'usePageTitle must be used inside a <Resource> component or provide a resource prop'
        );
    }

    const pageTitle = translate(`ra.page.${view}`, {
        name: getResourceLabel(resource, count),
        recordRepresentation: getRecordRepresentation(record),
    });

    return pageTitle;
};
