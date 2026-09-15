import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly editProfileButton: Locator;
  readonly cancelEditButton: Locator;
  readonly saveChangesButton: Locator;
  readonly usernameInput: Locator;
  readonly descriptionInput: Locator;
  readonly characterCounter: Locator;
  readonly deleteAccountButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly deleteModal: Locator;
  readonly profileNameHeader: Locator;
  readonly profileBioText: Locator;
  readonly profileSettingsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.editProfileButton = page.getByRole('button', { name: /edit profile/i });
    this.cancelEditButton = page.getByRole('button', { name: /cancel$/i });
    this.saveChangesButton = page.getByRole('button', { name: /save changes/i });
    this.usernameInput = page.getByLabel(/username/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.characterCounter = page.locator('text=/\\d+\\/150/');
    this.deleteAccountButton = page.getByRole('button', { name: /delete account/i });
    this.deleteModal = page.getByRole('dialog');
    // Busca el botón cancelar dentro del diálogo para evitar ambigüedad
    this.cancelDeleteButton = this.deleteModal.getByRole('button', { name: /(cancel|nevermind|no)/i });
    this.profileNameHeader = page.locator('h2');
    this.profileBioText = page.locator('p.bio');
    this.profileSettingsHeading = page.getByRole('heading', { name: /profile settings/i });
  }

  async goto() {
    await this.navigateTo('/');
  }

  async enterEditMode() {
    await this.editProfileButton.click();
  }

  async cancelEdit() {
    await this.cancelEditButton.click();
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }

  async updateDescription(text: string) {
    await this.descriptionInput.fill(text);
  }

  async typeUsernameSequentially(text: string) {
    await this.usernameInput.fill('');
    await this.usernameInput.pressSequentially(text);
  }

  async triggerDeleteAccount() {
    await this.deleteAccountButton.click();
  }

  async cancelAccountDeletion() {
    await this.cancelDeleteButton.click();
  }
}
