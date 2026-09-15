import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  // Overview locators
  readonly editProfileButton: Locator;
  readonly deleteAccountButton: Locator;

  // Edit form locators
  readonly profileSettingsHeading: Locator;
  readonly usernameInput: Locator;
  readonly visibilitySelect: Locator;
  readonly descriptionTextarea: Locator;
  readonly saveChangesButton: Locator;
  readonly cancelButton: Locator;

  // Danger zone modal locators
  readonly deleteConfirmationModal: Locator;
  readonly cancelModalButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.editProfileButton = page.getByRole('button', { name: 'Edit Profile' });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });

    this.profileSettingsHeading = page.getByText('Profile Settings');
    this.usernameInput = page.getByLabel(/username/i).or(page.locator('input[type="text"]').first());
    this.visibilitySelect = page.getByRole('combobox');
    this.descriptionTextarea = page.locator('textarea');
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    this.deleteConfirmationModal = page.getByText(/Are you sure you want to permanently delete/i);
    this.cancelModalButton = page.getByRole('button', { name: /cancel|abort|no/i }).last();
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterEditMode() {
    await this.editProfileButton.click();
    await expect(this.profileSettingsHeading).toBeVisible();
  }

  async typeUsernameSequentially(text: string) {
    await this.usernameInput.fill('');
    await this.usernameInput.pressSequentially(text);
  }

  async updateDescription(text: string) {
    await this.descriptionTextarea.fill(text);
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
  }

  async triggerDeleteAccount() {
    await this.deleteAccountButton.click();
    await expect(this.deleteConfirmationModal).toBeVisible();
  }

  async cancelAccountDeletion() {
    await this.cancelModalButton.click();
    await expect(this.deleteConfirmationModal).not.toBeVisible();
  }
}
