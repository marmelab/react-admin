const mock = () => {
    const PopperJS = jest.requireActual('@popperjs/core');
    return {
        placements: PopperJS.placements,
        destroy: () => {},
        scheduleUpdate: () => {},
        forceUpdate: () => {},
        render: function (this: any) {
            return this.$options._renderChildren;
        },
    };
};

export default mock;
export { mock as createPopper };
