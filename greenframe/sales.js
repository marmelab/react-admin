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

    const addMonths = (date, count) => {
        if (date && count) {
            const day = (date = new Date(+date)).getDate();
            date.setMonth(date.getMonth() + count, 1);
            const month = date.getMonth();
            date.setDate(day);
            if (date.getMonth() !== month) date.setDate(0); // 0 gives the last day of the previous month
        }
        return date;
    };

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

    await page.addMilestone('Go to Invoices list');
    await page.getByRole('menuitem', { name: 'Invoices' }).click();
    await waitForRaSettled();

    await page.addMilestone('Delete first invoice');
    await page.check(
        '[aria-label="Select\\ this\\ row"] input[type="checkbox"]'
    );
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByText('Element deleted');
    await waitForUndoableNotification();
    await waitForRaSettled();

    await page.addMilestone('Edit first remaining invoice');
    await page.locator('td').first().click();
    await waitForRaSettled();

    await page.addMilestone('Go to related Order');
    await page.getByRole('link').nth(1).click();
    await waitForRaSettled();

    await page.addMilestone('Edit the status');
    await page.getByRole('button', { name: /Status/ }).click();
    await page.getByRole('option', { name: 'delivered' }).click();

    await page.addMilestone('Click the Save button');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Element updated');
    await waitForUndoableNotification();
    await waitForRaSettled();

    await page.addMilestone('List all delivered orders');
    await page.getByRole('tab', { name: /delivered/ }).click();
    await waitForRaSettled();

    await page.addMilestone('Filter all orders passed since one month');
    await page.getByRole('button', { name: 'Add filter' }).click();
    await page.getByText('Passed Since').click();
    const oneMonthAgo = addMonths(new Date(), -1)
        .toISOString()
        .substring(0, 10);
    await page.getByLabel('Passed Since').fill(oneMonthAgo);
    await page.waitForNavigation();
    await waitForRaSettled();
};
