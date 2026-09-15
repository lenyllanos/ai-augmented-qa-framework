import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile.page';
import testData from '../../fixtures/profile-data.json';

test.describe('Feature: Profile Settings', () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await profile.goto();
  });

  test.describe('Read Mode & Navigation', () => {
    test('displays profile card details correctly', async ({ page }) => {
      await expect(page.getByText(testData.user.handle)).toBeVisible();
      await expect(page.getByText(testData.user.verifiedBadge)).toBeVisible();
      await expect(profile.editProfileButton).toBeVisible();
      await expect(profile.deleteAccountButton).toBeVisible();
    });

    test('toggles edit mode and allows canceling without saving', async () => {
      await profile.enterEditMode();
      await profile.cancelEdit();

      await expect(profile.editProfileButton).toBeVisible();
      await expect(profile.profileSettingsHeading).not.toBeVisible();
    });
  });

  test.describe('Data Persistence & Form Updates', () => {
    test('updates description and persists text in profile view', async ({ page }) => {
      const dynamicBio = `${testData.sampleBio} - ${Date.now()}`;

      await profile.enterEditMode();
      await profile.updateDescription(dynamicBio);
      await profile.saveChanges();

      await expect(profile.editProfileButton).toBeVisible();
      await expect(page.getByText(dynamicBio)).toBeVisible();
    });

    test('updates character counter dynamically', async ({ page }) => {
      await profile.enterEditMode();

      await profile.updateDescription('');
      await expect(page.getByText(/0\s*\/\s*300/)).toBeVisible();

      await profile.updateDescription('12345678901234567890');
      await expect(page.getByText(/20\s*\/\s*300/)).toBeVisible();
    });
  });

  test.describe('Username Validations & Sanitization', () => {
    test.beforeEach(async () => {
      await profile.enterEditMode();
    });

    test('blocks submit on empty username', async () => {
      await profile.usernameInput.fill('');
      await profile.saveChanges();
      await expect(profile.profileSettingsHeading).toBeVisible();
    });

    test('blocks submit when username is under 4 characters', async () => {
      await profile.usernameInput.fill(testData.validations.shortUsername);
      await profile.saveChanges();
      await expect(profile.profileSettingsHeading).toBeVisible();
    });

    test('filters out special characters and keeps alphanumeric', async () => {
      await profile.typeUsernameSequentially(testData.validations.specialCharsUsername);
      await expect(profile.usernameInput).toHaveValue(testData.validations.expectedCleanUsername);
    });

    test('filters out spaces', async () => {
      await profile.typeUsernameSequentially(testData.validations.spacedUsername);
      await expect(profile.usernameInput).toHaveValue(testData.validations.expectedCleanUsername);
    });

    test('restricts username length to maximum 15 characters', async () => {
      await profile.typeUsernameSequentially(testData.validations.longUsername);
      const value = await profile.usernameInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(testData.validations.maxUsernameLength);
    });
  });

  test.describe('Destructive Actions', () => {
    test('opens delete modal and cancels safely', async () => {
      await profile.triggerDeleteAccount();
      await profile.cancelAccountDeletion();
      await expect(profile.deleteAccountButton).toBeVisible();
    });
  });
});
