import { addons, types } from 'storybook/manager-api';

// Storybook renders panels in insertion order and has no API to configure it,
// so we move the Controls panel last to show the story code first.
addons.register('react-admin/panel-order', () => {
    const panels = addons.getElements(types.PANEL);
    const controls = panels['addon-controls'];
    delete panels['addon-controls'];
    panels['addon-controls'] = controls;
});
