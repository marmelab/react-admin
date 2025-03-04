declare const isSubsetOf: {
    (subset: any[] | Record<string, any | undefined> | null, superset: any[] | Record<string, any | undefined> | null, visited?: string[]): boolean;
    structural(subset: Record<string, any> | null, superset: Record<string, any> | null, visited?: string[]): boolean;
};
export { isSubsetOf };
