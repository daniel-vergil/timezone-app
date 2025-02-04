import HomePage from "./pages/home.page";
import { test as base } from "@playwright/test";

export type PageObjects = {
  homePage: HomePage;
};

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from "@playwright/test";
export type { Page, Locator, Response } from "@playwright/test";
