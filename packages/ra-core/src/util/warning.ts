export default (condition: any, message: string) => {
    if (condition && process.env.NODE_ENV !== 'production') {
        console.warn(message); // eslint-disable-line
    }
};
