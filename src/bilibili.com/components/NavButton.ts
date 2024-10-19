import obtainHTMLElementByID from "@/utils/obtainHTMLElementByID";
import { mdiAccountCancelOutline, mdiEyeOffOutline } from "@mdi/js";
import { render, html, nothing } from "lit-html";
import isNonNull from "@/utils/isNonNull";
import style from "../style";
import SettingsDrawer from "./SettingsDrawer";
import blockedUsers from "../models/blockedUsers";

export default class NavButton {
  private readonly settings: SettingsDrawer;

  constructor(settings: SettingsDrawer) {
    this.settings = settings;
  }

  public readonly render = () => {
    const parent = document.querySelector(".right-entry");
    if (!parent) {
      return;
    }
    const container = obtainHTMLElementByID({
      tag: "li",
      id: "009db887-c5b0-5de9-8f91-9bd52df60b6d",
      onDidCreate: (el) => {
        style.apply(el);
        el.classList.add("right-entry-item");
        parent.prepend(...[parent.firstChild, el].filter(isNonNull));
      },
    });
    const count = blockedUsers.distinctID().length;
    render(
      html`
<button
  type="button"
  class="right-entry__outside" 
  @click=${(e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.settings.open();
  }}
>
  <svg viewBox="2 2 20 20" class="right-entry-icon h-5 fill-current">
    <path fill-rule="evenodd" clip-rule="evenodd" d=${mdiEyeOffOutline}>
  </svg>
  <span class="right-entry-text">屏蔽</span>
</button>
`,
      container
    );
  };
}
