describe('Test sign up', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
        await element(by.id('SignUpButton')).tap();
    });

    test('should enter sign up screen', async() => {
        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should fail sign up', async() => {
        await element(by.id('signUpButton')).tap();
        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should fail sign up with invalid email', async() => {
        await element(by.id('emailText')).tap();
        await element(by.id('emailText')).typeText('test@mail');
        await element(by.id('firstnameText')).typeText('FirstName');
        await element(by.id('lastnameText')).typeText('LastName');
        await element(by.id('passwordText')).typeText('password');
        await element(by.id('signUpButton')).tap();
        await element(by.id('signUpButton')).tap();

        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should fail sign up with invalid firstname', async() => {
        await element(by.id('emailText')).tap();
        await element(by.id('emailText')).typeText('test@mail.com');
        await element(by.id('lastnameText')).typeText('LastName');
        await element(by.id('passwordText')).typeText('password');
        await element(by.id('signUpButton')).tap();
        await element(by.id('signUpButton')).tap();

        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should fail sign up with invalid lastname', async() => {
        await element(by.id('emailText')).tap();
        await element(by.id('emailText')).typeText('test@mail.com');
        await element(by.id('firstnameText')).typeText('FistName');
        await element(by.id('passwordText')).typeText('password');
        await element(by.id('signUpButton')).tap();
        await element(by.id('signUpButton')).tap();

        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should fail sign up with invalid password', async() => {
        await element(by.id('emailText')).tap();
        await element(by.id('emailText')).typeText('test@mail.com');
        await element(by.id('firstnameText')).typeText('FistName');
        await element(by.id('lastnameText')).typeText('LastName');
        await element(by.id('passwordText')).typeText('pass');
        await element(by.id('signUpButton')).tap();
        await element(by.id('signUpButton')).tap();

        await expect(element(by.id('emailText'))).toBeVisible();
        await expect(element(by.id('firstnameText'))).toBeVisible();
        await expect(element(by.id('lastnameText'))).toBeVisible();
        await expect(element(by.id('passwordText'))).toBeVisible();
    });

    test('should enter valid entries', async() => {
        await element(by.id('emailText')).tap();
        await element(by.id('emailText')).typeText('test@mail.com');
        await element(by.id('firstnameText')).typeText('FirstName');
        await element(by.id('lastnameText')).typeText('LastName');
        await element(by.id('passwordText')).typeText('password');
        await element(by.id('signUpButton')).tap();
        await element(by.id('signUpButton')).tap();

        await expect(element(by.id('calendarButton'))).toBeVisible();
        await expect(element(by.id('projectButton'))).toBeVisible();
        await expect(element(by.id('searchButton'))).toBeVisible();
        await expect(element(by.id('profileButton'))).toBeVisible();

        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
});