// eslint-disable-next-line no-unused-expressions
async page => {
    const raNotificationAutoHideDuration = 4000;
    const isRaSettled = () => !document.querySelector('.app-loader');
    const waitForRaSettled = async () =>
        await page.waitForFunction(isRaSettled, undefined, {
            polling: 500,
            timeout: 5000,
        });
    const waitForUndoableNotification = async () =>
        await page.waitForTimeout(raNotificationAutoHideDuration + 300);

    await page.goto('', {
        waitUntil: 'networkidle',
    });

    await page.addMilestone('Log in');
    await page.getByLabel('Username *').click();
    await page.getByLabel('Username *').fill('demo');
    await page.getByLabel('Username *').press('Tab');
    await page.getByLabel('Password *').fill('demo');
    await page.getByLabel('Password *').press('Enter');
    await page.getByText('Welcome to the react-admin e-commerce demo');

    await page.addMilestone('Go to Segments list');
    await page.getByRole('menuitem', { name: 'Segments' }).click();
    await waitForRaSettled();

    await page.addMilestone('List compulsive customers');
    await page
        .getByRole('row', { name: 'Compulsive Customers' })
        .getByRole('link', { name: 'Customers' })
        .click();
    await waitForRaSettled();

    await page.addMilestone('Edit first compulsive customer');
    await page.getByRole('row').getByRole('cell').nth(1).click();
    await waitForRaSettled();

    await page.getByRole('button', { name: /Segments/ }).click();
    await page.getByRole('option', { name: 'Compulsive' }).click();
    await page.locator('#menu-groups div').first().click();
    await page.addMilestone('Click Save button');
    await page.getByRole('button', { name: 'Save' }).click();
    await waitForUndoableNotification();
    await waitForRaSettled();

    await page.addMilestone('Remove compulsive filter');
    await page
        .getByRole('button', { name: 'Compulsive' })
        .getByRole('button')
        .click();
    await waitForRaSettled();

    await page.addMilestone('Add reviewer filter');
    await page.getByRole('button', { name: 'Reviewer' }).click();
    await waitForRaSettled();

    await page.addMilestone('Edit first reviewer customer');
    await page.getByRole('row').getByRole('cell').nth(1).click();
    await waitForRaSettled();

    await page.addMilestone('Go to review or poster');
    await page.getByRole('link').first().click();
    await waitForRaSettled();
};
