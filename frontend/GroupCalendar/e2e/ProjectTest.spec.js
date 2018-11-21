describe('Test Profile', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('projectButton')).tap();
    });

    test('should render all projects', async () => {
        await expect(element(by.id('Apple'))).toBeVisible();
        await expect(element(by.id('Banana'))).toBeVisible();
        await expect(element(by.id('Sushi'))).toBeVisible();
    });

    afterEach(async() => {
        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    })
});