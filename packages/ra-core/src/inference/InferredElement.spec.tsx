import InferredElement from './InferredElement';

describe('InferredElement', () => {
    it('should accept null type', () => {
        const ie = new InferredElement();
        expect(ie.getElement()).toBeUndefined();
    });
    describe('getRepresentation', () => {
        it('should return a default visual representation', () => {
            const DummyComponent = () => <span />;
            const dummyType = { component: DummyComponent };
            const ie = new InferredElement(dummyType, { source: 'foo' });
            expect(ie.getRepresentation()).toBe(
                '<DummyComponent source="foo" />'
            );
        });
        it('should return a representation based on the representation type property', () => {
            const DummyComponent = () => <span />;
            const dummyType = {
                component: DummyComponent,
                representation: props => `hello, ${props.source}!`,
            };
            const ie = new InferredElement(dummyType, { source: 'foo' });
            expect(ie.getRepresentation()).toBe('hello, foo!');
        });
    });
});
