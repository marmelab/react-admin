// eslint-disable-next-line no-unused-expressions
async page => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    // Click input[name="username"]
    await page.click('input[name="username"]');
    // Fill input[name="username"]
    await page.fill('input[name="username"]', 'demo');
    // Press Tab
    await page.press('input[name="username"]', 'Tab');
    // Fill input[name="password"]
    await page.fill('input[name="password"]', 'demo');
    // Click text=Sign in
    await page.click('text=Sign in');

    // Click text=Posters
    await page.click('text=Posters');
    await page.waitForNetworkIdle();

    // Click text=Categories
    await page.click('text=Categories');
    await page.waitForNetworkIdle();

    await page.click('a[role="menuitem"]:has-text("Customers")');
    await page.waitForNetworkIdle();

    // Click text=Segments
    await page.click('text=Segments');
    await page.waitForNetworkIdle();

    // Click text=Categories
    await page.click('text=Categories');
    await page.waitForNetworkIdle();

    // Click text=Posters
    await page.click('text=Posters');
    await page.waitForNetworkIdle();

    // Click text=Orders
    await page.click('text=Orders');
    await page.waitForNetworkIdle();

    // Check [aria-label="Select\ this\ row"] input[type="checkbox"]
    await page.check(
        '[aria-label="Select\\ this\\ row"] input[type="checkbox"]'
    );
    // Click text=Delete
    await page.click('text=Delete');
    await page.waitForNetworkIdle();

    // Check input[type="checkbox"]
    await page.check('input[type="checkbox"]');
    // Click text=Delete
    await page.click('text=Delete');
};
