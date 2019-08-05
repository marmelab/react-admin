export interface InputProps<Options = any> {
    className?: string;
    defaultValue?: any;
    fullWidth?: boolean;
    helperText?: string;
    label?: string;
    options?: Options;
    resource: string;
    source: string;
    [key: string]: any;
}
