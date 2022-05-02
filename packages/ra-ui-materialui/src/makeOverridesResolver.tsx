export function makeOverridesResolver(classes: { [key: string]: string }) {
    console.log(classes);
    return (props, styles) => [
        styles.root,
        ...Object.entries(classes).map(([name, cssClassName]) => ({
            [`& .${cssClassName}, &.${cssClassName}`]: styles[name],
        })),
    ];
}
