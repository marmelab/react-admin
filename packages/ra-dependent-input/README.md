# ra-dependent-input

A component for displaying inputs and fields depending on other inputs or fields values in [react-admin](https://github.com/marmelab/react-admin).

- [Installation](#installation)
- [Usage](#installation)
- [API](#api)

## Installation

Install with:

```sh
npm install --save ra-dependent-input
```

or

```sh
yarn add ra-dependent-input
```

## Usage

Check that the field specified by `dependsOn` has a value (a truthy value):

```js
import { Create, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { DependentInput } from 'ra-dependent-input';

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <BooleanInput source="hasEmail" label="Has email ?" />
            <DependentInput dependsOn="hasEmail">
                <TextInput source="email" />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

Check that the field specified by `dependsOn` has a specific value:

```js
import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { DependentInput } from 'ra-dependent-input';

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />

            <SelectInput source="category" choices={[
                { id: 'programming', name: 'Programming' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'photography', name: 'Photography' },
            ]} />

            <DependentInput dependsOn="category" value="programming">
                <SelectInput source="subcategory" choices={[
                    { id: 'js', name: 'JavaScript' },
                    { id: 'net', name: '.NET' },
                    { id: 'java', name: 'Java' },
                ]} />
            </DependentInput>

            <DependentInput dependsOn="category" value="lifestyle">
                <SelectInput source="subcategory" choices={[
                    ...
                ]} />
            </DependentInput>

            <DependentInput dependsOn="category" value="photography">
                <SelectInput source="subcategory" choices={[
                    ...
                ]} />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

Check that the field specified by `dependsOn` matches a custom constraint:

```js
import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { DependentInput } from 'ra-dependent-input';

const checkCustomConstraint = (value) => value.startsWith('programming'));

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <SelectInput source="category" choices={[
                    { id: 'programming_js', name: 'JavaScript' },
                    { id: 'programming_net', name: '.NET' },
                    { id: 'programming_java', name: 'Java' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
            ]} />

            <DependentInput dependsOn="category" resolve={checkCustomConstraint}>
                <SelectInput source="subcategory" choices={[
                    { id: 'js', name: 'JavaScript' },
                    { id: 'net', name: '.NET' },
                    { id: 'java', name: 'Java' },
                ]} />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

All powers! Check whether the current full record matches your constraints:

```js
import { Create, SimpleForm, TextInput, EmailInput } from 'react-admin';
import { DependentInput } from 'ra-dependent-input';

const checkRecord = (record) => record.firstName && record.lastName);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />

            <DependentInput resolve={checkRecord}>
                <EmailInput source="email" />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

## API

The `DependentInput` and `DependentField` components accepts the following props:

### dependsOn

Either a string indicating the name of the field to check (eg: `hasEmail`) or an array of fields to check (eg: `['firstName', 'lastName']`).

You can specify deep paths such as `author.firstName`.

### value

If not specified, only check that the field(s) specified by `dependsOn` have a truthy value.

You may specify a single value or an array of values. Deep paths will be correctly retrieved and compared to the specified values.

If both `value` and `resolve` are specified, `value` will be ignored.

### resolve

The `resolve` prop accepts a function which must return either `true` to display the child input or `false` to hide it.

If the `dependsOn` prop is specified, `resolve` will be called with either the value of the field specified by `dependsOn` (when a single field name was specified as `dependsOn`) or with an object matching the specified paths.

**Note**: When specifying deep paths (eg: `author.firstName`), `resolve` will be called with an object matching the specified structure. For example, when passing `['author.firstName', 'author.lastName']` as `dependsOn`, the `resolve` function will be passed the following object:

```js
{ author: { firstName: 'bValue', lastName: 'cValue' } }
```

If `dependsOn` is not specified, `resolve` will be called with the current form values (`DependentInput`) or the full record (`DependentField`).

If both `value` and `resolve` are specified, `value` will be ignored.

## Re-rendering the DependentInput children when the values of the dependencies change

This could be necessary to implement cascaded select. For example, a song may have a genre and a sub genre, which are retrieved with calls to an external service not hosted in our API.
This is how we could display only the sub genres for the selected genre:

```js
// in SubGenreInput.js
import React, { Component } from 'react';
import { translate, SelectInput } from 'react-admin';
import fetchSubGenres from './fetchSubGenres';

class SubGenreInput extends Component {
    state = {
        subgenres: [],
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dependsOnValue !== this.props.dependsOnValue) {
            this.fetchData(nextProps);
        }
    }

    fetchData(props) {
        fetchSubGenres(props.dependsOnValue).then(subgenres => {
            this.setState({ subgenres });
        })
    }

    render() {
        return <SelectInput {...this.props} choices={this.state.subgenres} />
    }
}

SubGenreInput.propTypes = SelectInput.propTypes;
SubGenreInput.defaultProps = SelectInput.defaultProps;

export default SubGenreInput;
```
