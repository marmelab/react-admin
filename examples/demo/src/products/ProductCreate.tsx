import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Create,
    FormTab,
    NumberInput,
    ReferenceInput,
    SelectInput,
    TabbedForm,
    TextInput,
    required,
} from 'react-admin';
import { InputAdornment } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

const schema = object({
    image: string().required('Please add image'),
    images: object({
        thumbnail: string().required('Please add thumbnail'),
    }),
});

const PREFIX = 'ProductCreate';

const classes = {
    price: `${PREFIX}-price`,
    width: `${PREFIX}-width`,
    height: `${PREFIX}-height`,
    stock: `${PREFIX}-stock`,
    widthFormGroup: `${PREFIX}-widthFormGroup`,
    heightFormGroup: `${PREFIX}-heightFormGroup`,
};

const StyledCreate = styled(Create)({
    [`& .${classes.price}`]: { width: '7em' },
    [`& .${classes.width}`]: { width: '7em' },
    [`& .${classes.height}`]: { width: '7em' },
    [`& .${classes.stock}`]: { width: '7em' },
    [`& .${classes.widthFormGroup}`]: { display: 'inline-block' },
    [`& .${classes.heightFormGroup}`]: {
        display: 'inline-block',
        marginLeft: 32,
    },
});

const ProductCreate = () => {
    return (
        <StyledCreate>
            <TabbedForm
                defaultValues={{ sales: 0 }}
                resolver={yupResolver(schema)}
            >
                <FormTab label="resources.products.tabs.image">
                    <TextInput autoFocus source="image" fullWidth />
                    <TextInput source="images.thumbnail" fullWidth />
                </FormTab>
                <FormTab label="resources.products.tabs.details" path="details">
                    <TextInput source="reference" validate={required()} />
                    <NumberInput
                        source="price"
                        validate={required()}
                        className={classes.price}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    €
                                </InputAdornment>
                            ),
                        }}
                    />
                    <NumberInput
                        source="width"
                        validate={required()}
                        className={classes.width}
                        formClassName={classes.widthFormGroup}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    cm
                                </InputAdornment>
                            ),
                        }}
                    />
                    <NumberInput
                        source="height"
                        validate={required()}
                        className={classes.height}
                        formClassName={classes.heightFormGroup}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    cm
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ReferenceInput source="category_id" reference="categories">
                        <SelectInput source="name" />
                    </ReferenceInput>
                    <NumberInput
                        source="stock"
                        validate={required()}
                        className={classes.stock}
                    />
                </FormTab>
                <FormTab
                    label="resources.products.tabs.description"
                    path="description"
                >
                    <RichTextInput source="description" label="" />
                </FormTab>
            </TabbedForm>
        </StyledCreate>
    );
};

export default ProductCreate;
