const segments = [
    'compulsive',
    'collector',
    'ordered_once',
    'regular',
    'returns',
    'reviewer',
];

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default segments.map(segment => ({
    id: segment,
    name: capitalizeFirstLetter(segment),
}));
