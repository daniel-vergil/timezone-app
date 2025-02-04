import { test, expect } from "../pageObjects/pageFixture";

test.describe("time keeper", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test("title is as expected", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Time Keeper/);
  });

  test("has header and information text", async ({ page }) => {});

  test("displays add timezone button", async ({ page }) => {});

  test("adds local user record on page load", async ({ page }) => {});

  test("can add a new record for each timezone and displays correct time", async ({
    page,
  }) => {});

  test("records are sorted in ascending order by local time", async ({
    page,
  }) => {});

  test("can delete existing records", async ({ page }) => {});

  test("cannot delete local timezome records", async ({ page }) => {});
});
