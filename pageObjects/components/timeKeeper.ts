import type { Page } from "@playwright/test";
import { BasePageComponent } from "../base.pageComponent";

export default class TimeKeeper extends BasePageComponent {
  readonly links = {
    header: this.host.getByRole("heading", { name: "Time Keeper" }),
    infoText: this.host.getByRole("paragraph", {
      name: "This app helps you keep track of your friends’ timezones!",
    }),
    addTimeZone: this.host.getByRole("button", { name: "Add timezone" }),
    timeZoneTable: this.host.getByRole("table", {}),
  };
}
