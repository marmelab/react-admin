import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import ContentSave from 'material-ui/svg-icons/content/save';

const SaveButton = () => <FlatButton type="submit" label="Save" icon={<ContentSave />} />;

export default SaveButton;
