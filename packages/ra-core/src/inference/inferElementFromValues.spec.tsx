import React, { SFC } from 'react';
import inferElementFromValues from './inferElementFromValues';
import InferredElement from './InferredElement';

interface Props {
    source: string;
    reference?: string;
}
describe('inferElementFromValues', () => {
    const Good: SFC<Props> = () => <span />;
    const Bad: SFC<Props> = () => <span />;
    const Dummy: SFC<{ [key: string]: any }> = () => <span />;

    it('should return an InferredElement', () => {
        const types = {
            string: { component: Good },
        };
        expect(inferElementFromValues('id', ['foo'], types)).toBeInstanceOf(InferredElement);
    });
    it('should fall back to the nearest type if type is absent', () => {
        const types = {
            string: { component: Good },
        };
        expect(inferElementFromValues('id', ['foo'], types).getElement()).toEqual(<Good source="id" />);
    });
    it('should return an id field for field named id', () => {
        const types = {
            id: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('id', ['foo', 'bar'], types).getElement()).toEqual(<Good source="id" />);
    });
    it('should return a reference field for field named *_id', () => {
        const types = {
            reference: { component: Good },
            string: { component: Bad },
            referenceChild: { component: Dummy },
        };
        expect(inferElementFromValues('foo_id', ['foo', 'bar'], types).getElement()).toEqual(
            <Good source="foo_id" reference="foos">
                <Dummy />
            </Good>
        );
    });
    it('should return a reference field for field named *Id', () => {
        const types = {
            reference: { component: Good },
            string: { component: Bad },
            referenceChild: { component: Dummy },
        };
        expect(inferElementFromValues('fooId', ['foo', 'bar'], types).getElement()).toEqual(
            <Good source="fooId" reference="foos">
                <Dummy />
            </Good>
        );
    });
    it('should return a reference array field for field named *_ids', () => {
        const types = {
            referenceArray: { component: Good },
            string: { component: Bad },
            referenceArrayChild: { component: Dummy },
        };
        expect(inferElementFromValues('foo_ids', ['foo', 'bar'], types).getElement()).toEqual(
            <Good source="foo_ids" reference="foos">
                <Dummy />
            </Good>
        );
    });
    it('should return a reference array field for field named *Ids', () => {
        const types = {
            referenceArray: { component: Good },
            string: { component: Bad },
            referenceArrayChild: { component: Dummy },
        };
        expect(inferElementFromValues('fooIds', ['foo', 'bar'], types).getElement()).toEqual(
            <Good source="fooIds" reference="foos">
                <Dummy />
            </Good>
        );
    });
    it('should return a string field for no values', () => {
        const types = {
            string: { component: Good },
            number: { component: Bad },
        };
        expect(inferElementFromValues('foo', [], types).getElement()).toEqual(<Good source="foo" />);
    });
    it('should return an array field for array of object values', () => {
        const types = {
            array: { component: Good },
            string: { component: Bad },
            number: { component: Dummy },
        };
        expect(
            inferElementFromValues('foo', [[{ bar: 1 }, { bar: 2 }], [{ bar: 3 }, { bar: 4 }]], types).getElement()
        ).toEqual(<Good source="foo">{[<Dummy key="0" source="bar" />]}</Good>);
    });
    it('should return a string field for array of non-object values', () => {
        const types = {
            array: { component: Bad },
            string: { component: Good },
        };
        expect(inferElementFromValues('foo', [[1, 2], [3, 4]], types).getElement()).toEqual(<Good source="foo" />);
    });
    it('should return a boolean field for boolean values', () => {
        const types = {
            boolean: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('foo', [true, false, true], types).getElement()).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date values', () => {
        const types = {
            date: { component: Good },
            string: { component: Bad },
        };
        expect(
            inferElementFromValues('foo', [new Date('2018-10-01'), new Date('2018-12-03')], types).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return an email field for email name', () => {
        const types = {
            email: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('email', ['whatever'], types).getElement()).toEqual(<Good source="email" />);
    });
    it.skip('should return an email field for email string values', () => {
        const types = {
            email: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('foo', ['me@example.com', 'you@foo.co.uk'], types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return an url field for url name', () => {
        const types = {
            url: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('url', ['whatever', 'whatever'], types).getElement()).toEqual(
            <Good source="url" />
        );
    });
    it.skip('should return an url field for url string values', () => {
        const types = {
            url: { component: Good },
            string: { component: Bad },
        };
        expect(
            inferElementFromValues(
                'foo',
                ['http://foo.com/bar', 'https://www.foo.com/index.html#foo'],
                types
            ).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date string values', () => {
        const types = {
            date: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('foo', ['2018-10-01', '2018-12-03'], types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a rich text field for HTML values', () => {
        const types = {
            richText: { component: Good },
            string: { component: Bad },
        };
        expect(
            inferElementFromValues(
                'foo',
                ['This is <h1>Good</h1>', '<body><h1>hello</h1>World</body>'],
                types
            ).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a string field for string values', () => {
        const types = {
            string: { component: Good },
            richText: { component: Bad },
        };
        expect(inferElementFromValues('foo', ['This is Good', 'hello, World!'], types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a number field for number values', () => {
        const types = {
            number: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('foo', [12, 1e23, 653.56], types).getElement()).toEqual(<Good source="foo" />);
    });
    it('should return a typed field for object values', () => {
        const types = {
            number: { component: Good },
            string: { component: Bad },
        };
        expect(inferElementFromValues('foo', [{ bar: 1, baz: 2 }, { bar: 3, baz: 4 }], types).getElement()).toEqual(
            <Good source="foo.bar" />
        );
    });
});
