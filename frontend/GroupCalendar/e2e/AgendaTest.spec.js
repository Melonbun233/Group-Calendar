describe('Test Agenda', () => {
    beforeAll(async () => {
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    test('should render agenda page', async () => {
        await expect(element(by.id('One time event 3'))).toBeVisible();
    });

    test('should show detailed project page', async() => {
        await element(by.id('One time event 3')).tap();
        await expect(element(by.id('projectNameButton'))).toBeVisible();
        await expect(element(by.id('projectStartDateButton'))).toBeVisible();
        await expect(element(by.id('projectEndDateButton'))).toBeVisible();
        await expect(element(by.id('memberButton'))).toBeVisible();
        await expect(element(by.id('eventButton'))).toBeVisible();
    });

    test('should not show start date pickers', async () => {
        await element(by.id('One time event 3')).tap();
        await expect(element(by.id('startDatePicker'))).toBeNotVisible();
        await element(by.id('projectStartDateButton')).tap();
        await expect(element(by.id('startDatePicker'))).toBeNotVisible();
    });

    test('should not show end date pickers', async () => {
        await element(by.id('One time event 3')).tap();
        await expect(element(by.id('endDatePicker'))).toBeNotVisible();
        await element(by.id('projectEndDateButton')).tap();
        await expect(element(by.id('endDatePicker'))).toBeNotVisible();
    });

    test('should not show members', async () => {
        await element(by.id('One time event 3')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
        await element(by.id('memberButton')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
    });

    test('should not show events', async () => {
        await element(by.id('One time event 3')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
        await element(by.id('eventButton')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
    });

    afterAll(async() => {
        await device.reloadReactNative();
        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
});