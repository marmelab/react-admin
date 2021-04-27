const sanitizeFieldRestProps: (props: any) => any = ({
    addLabel,
    allowEmpty,
    basePath,
    cellClassName,
    className,
    emptyText,
    formClassName,
    fullWidth,
    headerClassName,
    label,
    linkType,
    link,
    locale,
    record,
    refetch,
    resource,
    sortable,
    sortBy,
    sortByOrder,
    source,
    textAlign,
    translateChoice,
    ...props
}) => props;

export default sanitizeFieldRestProps;
