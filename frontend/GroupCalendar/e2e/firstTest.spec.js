describe('Test enter profile page', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('profileButton')).tap();
  });

  test('should enter profile main screen', async () => {
    await expect(element(by.id('editUserName'))).toBeVisible();
    await expect(element(by.id('editUserEmail'))).toBeVisible();
    await expect(element(by.id('editUserDescription'))).toBeVisible();
    await expect(element(by.id('editUserRegion'))).toBeVisible();
    await expect(element(by.id('editUserAge'))).toBeVisible();
    await expect(element(by.id('editUserGender'))).toBeVisible();
    await expect(element(by.id('editUserBirth'))).toBeVisible();
    await expect(element(by.id('signOutButton'))).toBeVisible();
  });

  test('should enter edit user name', async () => {
    await element(by.id('editUserName')).tap();
  });
})