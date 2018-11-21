describe('Test Profile', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('profileButton')).tap();
    });

    test('should display all profile elements', async() => {
        await expect(element(by.id('editUserName'))).toBeVisible();
        await expect(element(by.id('editUserEmail'))).toBeVisible();
        await expect(element(by.id('editUserDescription'))).toBeVisible();
        await expect(element(by.id('editUserRegion'))).toBeVisible();
        await expect(element(by.id('editUserAge'))).toBeVisible();
        await expect(element(by.id('editUserGender'))).toBeVisible();
        await expect(element(by.id('editUserBirth'))).toBeVisible();
        await expect(element(by.id('signOutButton'))).toBeVisible();
    });

    test('should modify user names', async() => {
        await element(by.id('editUserName')).tap();
        await expect(element(by.id('Last Name'))).toBeVisible();
        await expect(element(by.id('First Name'))).toBeVisible();
        await element(by.id('header-back')).tap();
    });

    test('should modify user description', async() => {
        await element(by.id('editUserDescription')).tap();
        await expect(element(by.id('What\'s Up'))).toBeVisible();
        await element(by.id('header-back')).tap();
    });

    test('should modify user region', async() => {
        await element(by.id('editUserRegion')).tap();
        await expect(element(by.id('Region'))).toBeVisible();
        await element(by.id('header-back')).tap();
    });

    test('should modify user gender', async() => {
        await element(by.id('editUserGender')).tap();
        //await expect(element(by.id('genderPicker'))).toBeVisible();
        await element(by.id('header-back')).tap();
    });

    test('should modify user birth', async() => {
        await element(by.id('editUserBirth')).tap();
        //await expect(element(by.id('datePicker'))).toBeVisible();
        await element(by.id('header-back')).tap();
    });

    afterEach(async () => {
        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
});