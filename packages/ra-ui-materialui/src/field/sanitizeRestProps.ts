const sanitizeRestProps: (props: any) => any = ({
    addLabel,
    allowEmpty,
    basePath,
    cellClassName,
    className,
    emptyText,
    formClassName,
    headerClassName,
    label,
    linkType,
    link,
    locale,
    record,
    resource,
    sortable,
    sortBy,
    sortByOrder,
    source,
    textAlign,
    translateChoice,
    ...props
}) => props;

export default sanitizeRestProps;
