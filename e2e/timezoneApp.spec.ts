import { test, expect } from "@playwright/test";
import { TimeKeeper } from "@/pageObjects/timekeeper";
import { getLocalTime } from "@/helpers/common";

// The timezoneRecords array contains the label and locales of the timezones we want to test.
const timezoneRecords = [
  { label: "EST", location: "America/New_York" },
  { label: "CST", location: "America/Chicago" },
  { label: "MST", location: "America/Denver" },
  { label: "PST", location: "America/Los_Angeles" },
  { label: "AST", location: "America/Juneau" },
  { label: "HST", location: "Pacific/Honolulu" },
];

const timeKeeperPage = function (page: any) {
  return new TimeKeeper(page);
};

test.describe("time keeper page", () => {
  test.beforeEach(async ({ page }) => {
    await timeKeeperPage(page).goto();
    await timeKeeperPage(page).pageLoaded();
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
      timeKeeperPage(page).createTimezoneRecord(record.label, record.location);
      const time = getLocalTime(record.location);
      await expect(page.getByText(record.label, { exact: true })).toBeVisible();
      await expect(
        page.getByText(record.location, { exact: true }),
      ).toBeVisible();
      await expect(page.locator(`text=${time}`).last()).toBeVisible();
    });
  });

  test("allows user to delete existing records", async ({ page }) => {
    timeKeeperPage(page).createTimezoneRecord(
      "John Doe - New York",
      "America/New_York",
    );
    await page
      .getByRole("button", { name: "Delete , John Doe - New York" })
      .click();
    await expect(page.locator("text=John Doe - New York")).not.toBeVisible();
  });

  test("displays updated time after a page refresh", async ({ page }) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await page.reload();
    await expect(page.getByRole("cell", { name: "Local(You)" })).toBeVisible();
    await expect(page.getByRole("cell", { name: locale })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: getLocalTime(locale) }),
    ).toBeVisible();
  });

  // skipping this test as it is a known issue
  test.skip("displays records sorted in ascending order by local time", async ({
    page,
  }) => {
    await timeKeeperPage(page).createTimezoneRecord("EST", "America/New_York");
    await timeKeeperPage(page).createTimezoneRecord("HST", "Pacific/Honolulu");

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

  // skipping this test as it is a known issue
  test.skip("allows multiple records to be added for the same timezone", async ({
    page,
  }) => {
    await timeKeeperPage(page).createTimezoneRecord(
      "Team Lead",
      "America/New_York",
    );
    await timeKeeperPage(page).createTimezoneRecord("SWE", "America/New_York");

    const recordLabels = await page
      .locator("tbody tr td:nth-child(1)")
      .allTextContents();
    expect(recordLabels.length).toEqual(3); // 2 records + Local(You)
  });
});
