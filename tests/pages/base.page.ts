import { Page, Locator, expect } from '@playwright/test';

const DEFAULT_BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega asegurando que la URL siempre tenga un host válido.
   */
  async navigateTo(path: string = '/') {
    const fullUrl = path.startsWith('http') ? path : `${DEFAULT_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
