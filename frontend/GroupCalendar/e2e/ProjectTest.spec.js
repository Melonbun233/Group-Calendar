describe('Test Project', () => {
    beforeAll(async () => {
        await element(by.id('UserEmail')).tap();
        await element(by.id('UserEmail')).typeText('test@mail.com');
        await element(by.id('UserPwd')).typeText('password');
        await element(by.id('AppSignInButton')).tap();
        await element(by.id('AppSignInButton')).tap();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
        await element(by.id('projectButton')).tap();
    });

    test('should render all projects', async () => {
        await expect(element(by.id('Apple'))).toBeVisible();
        await expect(element(by.id('Banana'))).toBeVisible();
        await expect(element(by.id('Sushi'))).toBeVisible();
    });

    test('should enter apple project', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('projectNameButton'))).toBeVisible();
        await expect(element(by.id('projectStartDateButton'))).toBeVisible();
        await expect(element(by.id('projectEndDateButton'))).toBeVisible();
        await expect(element(by.id('memberButton'))).toBeVisible();
        await expect(element(by.id('eventButton'))).toBeVisible();
        await expect(element(by.id('moreButton'))).toBeVisible();
    });

    test('should show start date pickers', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('startDatePicker'))).toBeNotVisible();
        await element(by.id('projectStartDateButton')).tap();
        await expect(element(by.id('startDatePicker'))).toBeVisible();
    });

    test('should show end date pickers', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('endDatePicker'))).toBeNotVisible();
        await element(by.id('projectEndDateButton')).tap();
        await expect(element(by.id('endDatePicker'))).toBeVisible();
    });

    test('should show members', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
        await element(by.id('memberButton')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeVisible();
    });

    test('should show events', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
        await element(by.id('eventButton')).tap();
        await expect(element(by.id('createEventButton'))).toBeVisible();
    });

    test('should show more', async () => {
        await element(by.id('Apple')).tap();
        await expect(element(by.id('deleteProjectButton'))).toBeNotVisible();
        await element(by.id('moreButton')).tap();
        await expect(element(by.id('deleteProjectButton'))).toBeVisible();
    });

    test('should not show delete user' , async () => {
        await element(by.id('Sushi')).tap();
        await expect(element(by.id('deleteProjectButton'))).toBeNotVisible();
        await element(by.id('moreButton')).tap();
        await expect(element(by.id('deleteProjectButton'))).toBeNotVisible();
    });

    test('should not show create event button', async () => {
        await element(by.id('Sushi')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
        await element(by.id('eventButton')).tap();
        await expect(element(by.id('createEventButton'))).toBeNotVisible();
    });

    test('should not show invite member button', async () => {
        await element(by.id('Sushi')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
        await element(by.id('memberButton')).tap();
        await expect(element(by.id('inviteMemberButton'))).toBeNotVisible();
    });

    //project creation test

    test('should render create project page', async() => {
        await element(by.id('createProjectButton')).tap();
        await expect(element(by.id('projectName'))).toBeVisible();
        await expect(element(by.id('projectDescription'))).toBeVisible();
        await expect(element(by.id('showStartDate'))).toBeVisible();
        await expect(element(by.id('showEndDate'))).toBeVisible();
        await expect(element(by.id('createButton'))).toBeVisible();
    });

    test('should not create due to empty project name', async() => {
        await element(by.id('createProjectButton')).tap();
        await element(by.id('projectDescription')).tap();
        await element(by.id('projectDescription')).typeText('Test Description');
        await element(by.id('createButton')).tap();
        await element(by.id('createButton')).tap();
        await expect(element(by.id('projectButton'))).toBeNotVisible();
    });

    test('should not create due to empty project description', async() => {
        await element(by.id('createProjectButton')).tap();
        await element(by.id('projectName')).tap();
        await element(by.id('projectName')).typeText('Test Name');
        await element(by.id('createButton')).tap();
        await element(by.id('createButton')).tap();
        await expect(element(by.id('projectButton'))).toBeNotVisible();
    });

    test('should create project', async() => {
        await element(by.id('createProjectButton')).tap();
        await element(by.id('projectName')).tap();
        await element(by.id('projectName')).typeText('Test Name');
        await element(by.id('projectDescription')).tap();
        await element(by.id('projectDescription')).typeText('Test Description');
        await element(by.id('createButton')).tap();
        await element(by.id('createButton')).tap();
        await expect(element(by.id('Test Name'))).toBeVisible();
    });


    afterAll(async() => {
        await device.reloadReactNative();
        await element(by.id('profileButton')).tap();
        await element(by.id('signOutButton')).tap();
    });
});