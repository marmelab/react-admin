/**
 * Help us workaround https://github.com/microsoft/TypeScript/issues/33626
 */
export function trickTSNamespaceInfer(value: any): any {
    return value;
}
