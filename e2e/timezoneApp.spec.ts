import { test, expect } from "@playwright/test";
import { TimeKeeper } from "../pageObjects/timekeeper";

// The timezoneRecords array contains the label and locales of the timezones we want to test.
const timezoneRecords = [
  { label: "EST", location: "America/New_York" },
  { label: "CST", location: "America/Chicago" },
  { label: "MST", location: "America/Denver" },
  { label: "PST", location: "America/Los_Angeles" },
  { label: "AST", location: "America/Juneau" },
  { label: "HST", location: "Pacific/Honolulu" },
];

// The getLocalTime function returns the current time in the specified locale.
function getLocalTime(locale: string) {
  let options = {
      timeZone: locale,
      hour: "numeric" as "numeric",
      minute: "numeric" as "numeric",
    },
    formatter = new Intl.DateTimeFormat([], options);

  return formatter.format(new Date());
}

test.describe("time keeper page", () => {
  test.beforeEach(async ({ page }) => {
    const timeKeeper = new TimeKeeper(page);
    await timeKeeper.goto();
    await timeKeeper.pageLoaded();
  });

  test("title is as expected", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Time Keeper/);
  });

  test("displays correct header and information text", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Time Keeper" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "This app helps you keep track of your friends’ timezones!",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("displays local time on page load", async ({ page }) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await expect(page.getByRole("cell", { name: "Local(You)" })).toBeVisible();
    await expect(page.getByRole("cell", { name: locale })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: getLocalTime(locale) }),
    ).toBeVisible();
  });

  // The forEach loop iterates over the timezoneRecords array and runs the test for each record.
  timezoneRecords.forEach((record) => {
    test(`allows user to add a new record for ${record.location} timezone and displays correct time`, async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Add timezone" }).click();
      await page.getByPlaceholder("Label").click();
      await page.getByPlaceholder("Label").fill(record.label);
      await page.getByLabel("Location").selectOption(record.location);
      const time = getLocalTime(record.location);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText(record.label, { exact: true })).toBeVisible();
      await expect(
        page.getByText(record.location, { exact: true }),
      ).toBeVisible();
      await expect(page.locator(`text=${time}`).last()).toBeVisible();
    });
  });

  test("allows user to delete existing records", async ({ page }) => {
    await page.getByRole("button", { name: "Add timezone" }).click();
    await page.getByPlaceholder("Label").click();
    await page.getByPlaceholder("Label").fill("John Doe - New York");
    await page.getByLabel("Location").selectOption("America/New_York");
    await page.getByRole("button", { name: "Save" }).click();
    await page
      .getByRole("button", { name: "Delete , John Doe - New York" })
      .click();
    await expect(page.locator("text=John Doe - New York")).not.toBeVisible();
  });

  // skipping this test as it is a known issue
  test.skip("displays records sorted in ascending order by local time", async ({
    page,
  }) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await page.getByRole("button", { name: "Add timezone" }).click();
    await page.getByPlaceholder("Label").click();
    await page.getByPlaceholder("Label").fill("EST");
    await page.getByLabel("Location").selectOption("America/New_York");
    const nyTime = getLocalTime("America/New_York");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("button", { name: "Add timezone" }).click();
    await page.getByPlaceholder("Label").click();
    await page.getByPlaceholder("Label").fill("HST");
    await page.getByLabel("Location").selectOption("Pacific/Honolulu");
    const denTime = getLocalTime("America/New_York");
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("button", { name: "Add timezone" }).click();
    const labelArray = await page
      .locator("tbody tr td:nth-child(1)")
      .allTextContents();
    const actualRecordLabels = labelArray.filter(function (item) {
      return item !== "Local(You)";
    });
    expect(actualRecordLabels).toEqual(["HST", "EST"]);
  });

  // skipping this test as it is a known issue
  test.skip("does not allow user to delete local timezone records", async ({
    page,
  }) => {
    await expect(
      page.locator("tbody tr:nth-of-type(1) td:nth-child(1)"),
    ).toBeDisabled();
  });
});
