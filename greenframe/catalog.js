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

    await page.addMilestone('Go to Categories list');
    await page.getByRole('menuitem', { name: 'Categories' }).click();
    await waitForRaSettled();

    await page.addMilestone('List Posters in the first Category');
    await page.locator('.MuiCardActions-root > a').first().click();
    await waitForRaSettled();

    await page.addMilestone('Edit first Poster');
    await page.getByRole('link', { name: /Brown Cow/ }).click();
    await waitForRaSettled();

    await page.addMilestone('Go to Details tab');
    await page.getByRole('tab', { name: 'Details' }).click();
    await waitForRaSettled();

    await page.getByRole('button', { name: 'Category animals' }).click();
    await page.getByRole('option', { name: 'travel' }).click();
    await page.addMilestone('Click Save button');
    await page.getByRole('button', { name: 'Save' }).click();
    await waitForUndoableNotification();
    await waitForRaSettled();

    await page.addMilestone('Go back to editing first Poster');
    // Disable the 'animals' filter
    await page
        .getByRole('button', { name: 'Animals' })
        .getByRole('button')
        .click();
    await page.getByRole('link', { name: /Brown Cow/ }).click();
    await waitForRaSettled();

    await page.addMilestone('Go to Reviews tab');
    await page.getByRole('tab', { name: /Reviews/ }).click();
    await waitForRaSettled();
    await page.getByText('Rating');
};
