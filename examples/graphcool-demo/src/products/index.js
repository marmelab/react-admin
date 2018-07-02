import React from 'react';
import {
    translate,
    Create,
    Datagrid,
    DateField,
    Edit,
    EditButton,
    Filter,
    FormTab,
    List,
    NumberInput,
    ReferenceInput,
    ReferenceManyField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
} from 'react-admin';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/icons/Collections';
import RichTextInput from 'ra-input-rich-text';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import GridList from './GridList';
import Poster from './Poster';
import { withStyles } from '@material-ui/core/styles';

export const ProductIcon = Icon;

const QuickFilter = translate(({ label, translate }) => (
    <Chip>{translate(label)}</Chip>
));

export const ProductFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <ReferenceInput source="category.id" reference="Category">
            <SelectInput source="name" />
        </ReferenceInput>
        <NumberInput source="width_gte" />
        <NumberInput source="width_lte" />
        <NumberInput source="height_gte" />
        <NumberInput source="height_lte" />
        <QuickFilter
            label="resources.Product.fields.stock_lte"
            source="stock_lte"
            defaultValue={10}
        />
    </Filter>
);

export const ProductList = props => (
    <List {...props} filters={<ProductFilter />} perPage={20}>
        <GridList />
    </List>
);

const stylesCreate = {
    price: { width: '5em' },
    width: { width: '5em' },
    widthForm: { display: 'inline-block' },
    height: { width: '5em' },
    heightForm: { display: 'inline-block', marginLeft: 32 },
    stock: { width: '5em' },
};

export const ProductCreate = withStyles(stylesCreate)(
    ({ classes, ...props }) => (
        <Create {...props}>
            <TabbedForm>
                <FormTab label="resources.Product.tabs.image">
                    <TextInput
                        source="image"
                        options={{ fullWidth: true }}
                        validation={{ required: true }}
                    />
                    <TextInput
                        source="thumbnail"
                        options={{ fullWidth: true }}
                        validation={{ required: true }}
                    />
                </FormTab>
                <FormTab label="resources.Product.tabs.details">
                    <TextInput
                        source="reference"
                        validation={{ required: true }}
                    />
                    <NumberInput
                        source="price"
                        validation={{ required: true }}
                        classes={classes.price}
                    />
                    <NumberInput
                        source="width"
                        validation={{ required: true }}
                        classes={classes.width}
                        formClassName={classes.widthForm}
                    />
                    <NumberInput
                        source="height"
                        validation={{ required: true }}
                        classes={classes.height}
                        formClassName={classes.heightForm}
                    />
                    <ReferenceInput
                        source="category.id"
                        reference="Category"
                        allowEmpty
                    >
                        <SelectInput source="name" />
                    </ReferenceInput>
                    <NumberInput
                        source="stock"
                        validation={{ required: true }}
                        className={classes.stock}
                    />
                </FormTab>
                <FormTab label="resources.Product.tabs.description">
                    <RichTextInput source="description" addLabel={false} />
                </FormTab>
            </TabbedForm>
        </Create>
    )
);

const ProductTitle = ({ record }) => <span>Poster #{record.reference}</span>;

const stylesEdit = {
    comment: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    price: { width: '5em' },
    width: { width: '5em' },
    widthForm: { display: 'inline-block' },
    height: { width: '5em' },
    heightForm: { display: 'inline-block', marginLeft: 32 },
    stock: { width: '5em' },
};

export const ProductEdit = withStyles(stylesEdit)(({ classes, ...props }) => (
    <Edit {...props} title={<ProductTitle />}>
        <TabbedForm>
            <FormTab label="resources.Product.tabs.image">
                <Poster />
                <TextInput source="image" options={{ fullWidth: true }} />
                <TextInput source="thumbnail" options={{ fullWidth: true }} />
            </FormTab>
            <FormTab label="resources.Product.tabs.details">
                <TextInput source="reference" />
                <NumberInput source="price" className={classes.price} />
                <NumberInput
                    source="width"
                    formClassName={classes.widthForm}
                    className={classes.width}
                />
                <NumberInput
                    source="height"
                    formClassName={classes.heightForm}
                    className={classes.height}
                />
                <ReferenceInput source="category.id" reference="Category">
                    <SelectInput source="name" />
                </ReferenceInput>
                <NumberInput source="stock" formClassName={classes.stock} />
            </FormTab>
            <FormTab label="resources.Product.tabs.description">
                <RichTextInput source="description" addLabel={false} />
            </FormTab>
            <FormTab label="resources.Product.tabs.reviews">
                <ReferenceManyField
                    reference="Review"
                    target="product.id"
                    addLabel={false}
                >
                    <Datagrid>
                        <DateField source="date" />
                        <CustomerReferenceField />
                        <StarRatingField />
                        <TextField
                            source="comment"
                            className={classes.comment}
                        />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
));
