describe('Test sign in', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    test('should correctly display signin page', async() => {
        await expect(element(by.id('UserEmail'))).toBeVisible();
        await expect(element(by.id('UserPwd'))).toBeVisible();
        await expect(element(by.id('AppSignInButton'))).toBeVisible();
        await expect(element(by.id('GoogleSignInButton'))).toBeVisible();
    });

    test('should not enter sign in by app', async() => {
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('incorrect@mail.com');
        await element(by.id('UserPwd')).typeText('incorrect');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();

        await expect(element(by.id('calendarButton'))).toBeNotVisible();
        await expect(element(by.id('projectButton'))).toBeNotVisible();
        await expect(element(by.id('searchButton'))).toBeNotVisible();
        await expect(element(by.id('profileButton'))).toBeNotVisible();
    });
    
    test('should enter sign in by app', async() => {
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
    
        await expect(element(by.id('calendarButton'))).toBeVisible();
        await expect(element(by.id('projectButton'))).toBeVisible();
        await expect(element(by.id('searchButton'))).toBeVisible();
        await expect(element(by.id('profileButton'))).toBeVisible();

        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
    
});