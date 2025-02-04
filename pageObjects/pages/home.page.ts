import { BasePage } from "../base.page";
import TimeKeeper from "../components/timeKeeper";

export default class HomePage extends BasePage {
  readonly timeKeeper = new TimeKeeper(this.page.locator("selector")).host;

  async open() {
    await super.open("/");
  }
}
