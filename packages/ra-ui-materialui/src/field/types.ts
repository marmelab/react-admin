export interface FieldProps {
    addLabel?: boolean;
    basePath?: string;
    record?: object;
    sortBy?: string;
    source?: string;
    label?: string;
    sortable?: boolean;
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    textAlign?: 'right' | 'left';
    translate?: (v: string) => string;
}
