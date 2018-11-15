import React from 'react';
import {
    translate,
    AutocompleteInput,
    BooleanInput,
    DateInput,
    EditController,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TitleForRecord,
} from 'react-admin';
import Card from '@material-ui/core/Card';
import withStyles from '@material-ui/core/styles/withStyles';

import Basket from './Basket';

const CommandTitle = translate(({ record, translate }) => (
    <span>
        {translate('resources.commands.name', { smart_count: 1 })} #{
            record.reference
        }
    </span>
));

const editStyles = {
    root: { display: 'flex', alignItems: 'flex-start' },
    form: { flexGrow: 2, marginRight: '2em' },
};

const CommandEdit = ({ classes, ...props }) => (
    <EditController title={<CommandTitle />} {...props}>
        {controllerProps =>
            controllerProps.record ? (
                <div className={classes.root}>
                    <Card className={classes.form}>
                        <TitleForRecord
                            defaultTitle={controllerProps.defaultTitle}
                            record={controllerProps.record}
                        />
                        <SimpleForm {...controllerProps}>
                            <DateInput source="date" />
                            <ReferenceInput
                                source="customer_id"
                                reference="customers"
                            >
                                <AutocompleteInput
                                    optionText={choice =>
                                        `${choice.first_name} ${
                                            choice.last_name
                                        }`
                                    }
                                />
                            </ReferenceInput>
                            <SelectInput
                                source="status"
                                choices={[
                                    { id: 'delivered', name: 'delivered' },
                                    { id: 'ordered', name: 'ordered' },
                                    { id: 'cancelled', name: 'cancelled' },
                                    { id: 'unknown', name: 'unknown', disabled: true },
                                ]}
                            />
                            <BooleanInput source="returned" />
                        </SimpleForm>
                    </Card>
                    <Basket record={controllerProps.record} />
                </div>
            ) : (
                ''
            )
        }
    </EditController>
);

export default withStyles(editStyles)(CommandEdit);
