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
    await page.addMilestone('Go to Categories list');
    await page.getByRole('menuitem', { name: 'Categories' }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('List Posters in the first Category');
    await page.locator('.MuiCardActions-root > a').first().click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Edit first Poster');
    await page.getByRole('link', { name: /Brown Cow/ }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Go to Details tab');
    await page.getByRole('tab', { name: 'Details' }).click();
    await page.waitForNetworkIdle();
    await page.getByRole('button', { name: 'Category animals' }).click();
    await page.getByRole('option', { name: 'travel' }).click();
    await page.addMilestone('Click Save button');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Go back to editing first Poster');
    await page.getByRole('link', { name: /Brown Cow/ }).click();
    await page.waitForNetworkIdle();
    await page.addMilestone('Go to Reviews tab');
    await page.getByRole('tab', { name: /Reviews/ }).click();
    await page.waitForNetworkIdle();
};
