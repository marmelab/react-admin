import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Tabs,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Form,
    RecordContextProvider,
    SaveContextProvider,
    SaveButton,
    TextInput,
} from 'react-admin';
import {
    ResourceConfiguration,
    FieldConfiguration,
} from './ResourceConfigurationContext';
import { useResourceConfiguration } from './useResourceConfiguration';
import { FieldConfigurationFormSection } from './FieldConfigurationFormSection';
import { FieldConfigurationTab } from './FieldConfigurationTab';

export const ResourceConfigurationPage = () => {
    const { resource } = useParams<'resource'>();
    const [resourceConfiguration, actions] = useResourceConfiguration(resource);
    const [activeField, setActiveField] = useState<FieldConfiguration>();

    const save = (values: ResourceConfiguration) => {
        actions.update(values);
    };
    const saveContext = {
        save,
    };

    const handleTabChange = (event, newValue) => {
        const newField = resourceConfiguration.fields.find(
            f => f.props.source === newValue
        );
        setActiveField(newField);
    };

    useEffect(() => {
        if (resourceConfiguration && resourceConfiguration.fields) {
            setActiveField(resourceConfiguration.fields[0]);
        }
    }, [resourceConfiguration]);

    if (!resourceConfiguration || !activeField) {
        return null;
    }

    return (
        <RecordContextProvider value={resourceConfiguration}>
            <SaveContextProvider value={saveContext}>
                <Form onSubmit={save} defaultValues={resourceConfiguration}>
                    <StyledCard>
                        <CardHeader
                            avatar={
                                <Avatar>
                                    {
                                        // TODO: Add an icon selector
                                        (
                                            resourceConfiguration.label ||
                                            resourceConfiguration.name
                                        ).substr(0, 1)
                                    }
                                </Avatar>
                            }
                            action={
                                // TODO: Add a menu with resource related actions (delete, etc.)
                                <IconButton aria-label="settings" size="large">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={`Configuration of ${
                                resourceConfiguration.label ||
                                resourceConfiguration.name
                            }`}
                        />
                        <CardContent>
                            <TextInput
                                source="label"
                                defaultValue={
                                    resourceConfiguration.label ||
                                    resourceConfiguration.name
                                }
                            />
                        </CardContent>
                        <Divider />
                        <div className={classes.fields}>
                            <Tabs
                                orientation="vertical"
                                value={activeField.props.source}
                                onChange={handleTabChange}
                                className={classes.fieldList}
                            >
                                {resourceConfiguration.fields.map(field => (
                                    <FieldConfigurationTab
                                        key={`${field.props.source}_tab`}
                                        field={field}
                                        value={field.props.source}
                                        resource={resource}
                                    />
                                ))}
                            </Tabs>
                            {resourceConfiguration.fields.map(
                                (field, index) => (
                                    <div
                                        key={`${field.props.source}_panel`}
                                        role="tabpanel"
                                        hidden={
                                            activeField.props.source !==
                                            field.props.source
                                        }
                                        id={`nav-tabpanel-${field.props.source}`}
                                        aria-labelledby={`nav-tab-${field.props.source}`}
                                    >
                                        {activeField.props.source ===
                                        field.props.source ? (
                                            <FieldConfigurationFormSection
                                                key={field.props.source}
                                                field={field}
                                                sourcePrefix={`fields[${index}]`}
                                                className={classes.fieldPanel}
                                                resource={resource}
                                            />
                                        ) : null}
                                    </div>
                                )
                            )}
                        </div>
                        <CardActions className={classes.actions}>
                            <SaveButton />
                        </CardActions>
                    </StyledCard>
                </Form>
            </SaveContextProvider>
        </RecordContextProvider>
    );
};

const PREFIX = 'ResourceConfigurationPage';

const classes = {
    fields: `${PREFIX}-fields`,
    fieldList: `${PREFIX}-fieldList`,
    fieldTitle: `${PREFIX}-fieldTitle`,
    fieldPanel: `${PREFIX}-fieldPanel`,
    actions: `${PREFIX}-actions`,
};

const StyledCard = styled(Card)(({ theme }) => ({
    [`& .${classes.fields}`]: {
        display: 'flex',
    },

    [`& .${classes.fieldList}`]: {
        backgroundColor: theme.palette.background.default,
    },

    [`& .${classes.fieldTitle}`]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textTransform: 'none',
        minHeight: 0,
    },

    [`& .${classes.fieldPanel}`]: {
        flexGrow: 1,
    },

    [`& .${classes.actions}`]: {
        backgroundColor: theme.palette.background.default,
    },
}));
