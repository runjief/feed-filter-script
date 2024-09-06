// ==UserScript==
// @namespace urn:runjief:feed-filter-script
// @name feed-filter-script
// @description 避免看到指定用户上传的视频，在用户个人主页会多出一个屏蔽按钮。
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.deleteValue
// @include	 https://search.bilibili.com/*
// @include	 https://space.bilibili.com/*
// @include	 https://www.bilibili.com/*
// @run-at   document-idle
// ==/UserScript==

// spell-checker: word bili bilibili upname

import obtainHTMLElement from "./utils/obtainHTMLElement";
import useGMValue from "./utils/useGMValue";
import usePolling from "./utils/usePolling";

export {};

const blockedUsers = useGMValue(
  "blockedUsers@b020a2c5-0839-5573-9fcf-7eba106ff8c4",
  {} as Record<string, boolean | undefined>
);

async function migrateV1() {
  const key = "blockedUserIDs@89f186cd-f6ba-530d-b8b2-171f916d8888";
  const oldValue = await GM.getValue(key);
  if (!oldValue) {
    return;
  }
  const newValue = { ...blockedUsers.value };
  (JSON.parse(String(oldValue)) as string[]).forEach((i) => {
    newValue[i] = true;
  });
  blockedUsers.value = newValue;
  await GM.deleteValue(key);
}

function renderBlockButton(userID: string) {
  const isBlocked = blockedUsers.value[userID];
  const el = obtainHTMLElement("span", "89f186cd-f6ba-530d-b8b2-171f916d8888");
  el.classList.add("h-f-btn");
  el.textContent = isBlocked ? "取消屏蔽" : "屏蔽";
  el.onclick = async () => {
    blockedUsers.value = {
      ...blockedUsers.value,
      [userID]: !isBlocked || undefined,
    };
    renderBlockButton(userID);
  };

  const parent = document.querySelector(".h-action") || document.body;
  parent.prepend(el);
}

function parseUserURL(rawURL: string | undefined): string | undefined {
  if (!rawURL) {
    return;
  }
  const url = new URL(rawURL, window.location.href);
  if (url.host !== "space.bilibili.com") {
    return;
  }
  const match = /^\/(\d+)\/?/.exec(url.pathname);
  if (!match) {
    return;
  }
  return match[1];
}

function renderVideoCard() {
  document.querySelectorAll(".bili-video-card").forEach((i) => {
    const rawURL = i
      .querySelector("a.bili-video-card__info--owner")
      ?.getAttribute("href");
    const userID = parseUserURL(rawURL);
    if (!userID) {
      return;
    }
    const isBlocked = blockedUsers.value[userID];
    const container = i.parentElement.classList.contains("video-list-item")
      ? i.parentElement
      : i;
    if (isBlocked) {
      container.setAttribute("hidden", "");
    } else {
      container.removeAttribute("hidden");
    }
  });

  document.querySelectorAll(".video-page-card-small").forEach((i) => {
    const rawURL = i.querySelector(".upname a")?.getAttribute("href");
    if (!rawURL) {
      return;
    }
    const userID = parseUserURL(rawURL);
    if (!userID) {
      return;
    }
    const isBlocked = blockedUsers.value[userID];
    const container = i;
    if (isBlocked) {
      container.setAttribute("hidden", "");
    } else {
      container.removeAttribute("hidden");
    }
  });
}

async function main() {
  await migrateV1();
  if (window.location.host === "space.bilibili.com") {
    const userID = parseUserURL(window.location.href);
    if (!userID) {
      return;
    }
    usePolling({
      update: () => renderBlockButton(userID),
    });
  } else {
    usePolling({
      update: () => renderVideoCard(),
    });
  }
}

main();
