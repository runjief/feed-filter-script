import injectStyle from "@/utils/injectStyle";
import css from "./style.css";
const id = "4655bb73-fa92-5e3b-9dcc-d04341d4bac3";
const attributeName = `data-${id}`;

export default {
  id,
  css,
  attributeName,
  inject() {
    injectStyle(id, css);
  },
  apply(el: HTMLElement) {
    el.setAttribute(attributeName, "");
  },
};
