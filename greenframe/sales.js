// eslint-disable-next-line no-unused-expressions
async page => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });

    await page.addMilestone('Log in');
    await page.getByLabel('Username *').click();
    await page.getByLabel('Username *').fill('demo');
    await page.getByLabel('Username *').press('Tab');
    await page.getByLabel('Password *').fill('demo');
    await page.getByLabel('Password *').press('Enter');
    await page.waitForNetworkIdle();
    await page.addMilestone('Go to Invoices list');
    await page.getByRole('menuitem', { name: 'Invoices' }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Delete first invoice');
    await page.check(
        '[aria-label="Select\\ this\\ row"] input[type="checkbox"]'
    );
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Edit first remaining invoice');
    await page.locator('td').first().click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Go to related Order');
    await page.getByRole('link').nth(1).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Edit the status');
    await page.getByRole('button', { name: /Status/ }).click();
    await page.getByRole('option', { name: 'delivered' }).click();
    await page.addMilestone('Click the Save button');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('List all delivered orders');
    await page.getByRole('tab', { name: /delivered/ }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Filter all orders passed since 2023-06-14');
    await page.getByRole('button', { name: 'Add filter' }).click();
    await page.getByText('Passed Since').click();
    await page.getByLabel('Passed Since').fill('2023-06-14');
    await page.waitForNetworkIdle();
};
