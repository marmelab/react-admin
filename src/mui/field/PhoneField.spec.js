import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PhoneField, {
    localPhoneFormat,
    phoneFormatToString,
} from './PhoneField';

describe('localPhoneFormat', () => {
    it('should return a plain text international number (with no space)', () => {
        assert.equal(
            localPhoneFormat({ country: 'FR', phone: '687542154' }),
            '+33687542154'
        );
    });

    it('should return a national number', () => {
        assert.equal(
            localPhoneFormat({ country: 'FR', phone: '687542154' }, 'FR'),
            '06 87 54 21 54'
        );
    });

    it('should return a international number', () => {
        assert.equal(
            localPhoneFormat({ country: 'US', phone: '2344565656' }, 'FR'),
            '+1 234 456 5656'
        );
    });
});

describe('phoneFormatToString', () => {
    it('should return null when no number is set)', () => {
        assert.equal(phoneFormatToString(), null);
    });

    it('should return null if text is parsed', () => {
        assert.equal(phoneFormatToString('toto'), null);
    });

    it('should return null if invalid number is parsed', () => {
        assert.equal(phoneFormatToString('568989'), null);
    });

    it('should return a national number', () => {
        assert.equal(phoneFormatToString('+33612121212'), '06 12 12 12 12');
    });

    it('should return a international number', () => {
        assert.equal(phoneFormatToString('+12344565656'), '+1 234 456 5656');
    });
});

describe('<PhoneField />', () => {
    it('should return null when the record is not set', () => {
        const wrapper = shallow(<PhoneField source="phone" />);
        assert.equal(wrapper.html(), '');
    });

    it('should return null when the record has no value for the source', () => {
        const wrapper = shallow(<PhoneField record={{}} source="foo" />);
        assert.equal(wrapper.html(), '');
    });

    it('should render null when number from the source is null ', () => {
        const record = { number: '' };
        const wrapper = shallow(<PhoneField record={record} source="number" />);
        assert.equal(wrapper.html(), '');
    });

    it('should display an phone (tel) link', () => {
        const record = { phone: '+33687542154' };
        const wrapper = shallow(<PhoneField record={record} source="phone" />);
        assert.equal(
            wrapper.html(),
            '<a href="tel:+33687542154">06 87 54 21 54</a>'
        );
    });

    it('should render as a phone number', () => {
        const record = { number: '06 05 47 47 58' };
        const wrapper = shallow(<PhoneField record={record} source="number" />);
        assert.equal(
            wrapper.html(),
            '<a href="tel:+33605474758">06 05 47 47 58</a>'
        );
    });

    it('should render as a phone number with US locale', () => {
        const record = { number: '+12344545656' };
        const wrapper = shallow(
            <PhoneField record={record} source="number" locale="US" />
        );
        assert.equal(
            wrapper.html(),
            '<a href="tel:+12344545656">(234) 454-5656</a>'
        );
    });
});
