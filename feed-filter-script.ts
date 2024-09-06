// ==UserScript==
// @namespace urn:runjief:feed-filter-script
// @name feed-filter-script
// @description 避免看到指定用户上传的视频，在用户个人主页会多出一个屏蔽按钮。
// @version  1
// @grant    GM.getValue
// @grant    GM.setValue
// @include	 https://search.bilibili.com/*
// @include	 https://space.bilibili.com/*
// @include	 https://www.bilibili.com/*
// @run-at   document-idle
// ==/UserScript==

// spell-checker: word bili bilibili

import obtainHTMLElement from "./utils/obtainHTMLElement";
import toggleArrayItem from "./utils/toggleArrayItem";
import useGMValue from "./utils/useGMValue";

export {};

const blockedUserIDs = useGMValue(
  "blockedUserIDs@89f186cd-f6ba-530d-b8b2-171f916d8888",
  [] as string[]
);

function renderBlockButton(userID: string) {
  const { isLoading } = blockedUserIDs;

  const isBlocked = blockedUserIDs.value.includes(userID);

  const el = obtainHTMLElement(
    "button",
    "89f186cd-f6ba-530d-b8b2-171f916d8888"
  );
  el.setAttribute("type", "button");
  el.classList.add("h-f-btn");
  el.style.width = "auto";
  el.style.minWidth = "76px";
  el.textContent = isBlocked ? "取消屏蔽" : "屏蔽";
  if (isLoading) {
    el.textContent = "加载屏蔽列表...";
  }
  el.onclick = () => {
    if (isLoading) {
      return;
    }
    const arr = blockedUserIDs.value.slice();
    toggleArrayItem(arr, userID);
    blockedUserIDs.value = arr;
    renderBlockButton(userID);
  };

  const parent = document.querySelector(".h-action") || document.body;
  parent.prepend(el);
}

function renderVideoCard() {
  document.querySelectorAll(".bili-video-card").forEach((i) => {
    const rawURL = i
      .querySelector("a.bili-video-card__info--owner")
      ?.getAttribute("href");
    if (!rawURL) {
      return;
    }
    const match = /^\/(\d+)$/.exec(
      new URL(rawURL, window.location.href).pathname
    );
    if (!match) {
      return;
    }
    const userID = match[1];
    const isBlocked = blockedUserIDs.value.includes(userID);
    if (isBlocked) {
      i.setAttribute("hidden", "");
    } else {
      i.removeAttribute("hidden");
    }
  });
}

function main() {
  if (window.location.host === "space.bilibili.com") {
    const match = /^\/(\d+)$/.exec(window.location.pathname);
    if (!match) {
      return;
    }
    const userID = match[1];
    renderBlockButton(userID);
    setInterval(() => renderBlockButton(userID), 200);
  } else {
    setInterval(() => renderVideoCard(), 200);
  }
}

main();
