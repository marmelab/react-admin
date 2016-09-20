import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';

// Quill depends of MutationObserver which is not implemented in JSDom and
// would require PhantomJS to be tested.
// @see https://github.com/tmpvar/jsdom/issues/639
describe.skip('<RichTextInput />', () => {
    it('should display editor with toolbar');
    it('should initialize editor with source value');
    it('should trigger the `onChange` props with source and new value when edited');
});
