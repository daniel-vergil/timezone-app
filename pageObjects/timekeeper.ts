import { expect, Page, Locator } from "@playwright/test";

export class TimeKeeper {
  public path = "/";

  readonly page: Page;

  readonly $timeKeeper: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$timeKeeper = this.page.locator("body").first();
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async pageLoaded() {
    return expect(this.$timeKeeper).toBeVisible();
  }
}
