(function () {
  "use strict";

  const currentScript = document.currentScript;
  const brandId = currentScript?.getAttribute("data-brand-id") || "vastra-demo";
  const apiUrl =
    currentScript?.getAttribute("data-api-url") || "http://localhost:5000";
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  function getBrandName(id) {
    if (id === "vastra-demo") return "Teviq Vastra Demo";
    return id
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const fallbackConfig = {
    brandName: getBrandName(brandId),
    widgetTitle: `${getBrandName(brandId)} Support`,
    welcomeMessage: `Hi, welcome to ${getBrandName(brandId)} support. How can I help?`,
    themeColor: "#101828",
    position: "bottom-right",
    quickReplies: ["Track my order", "Return / Exchange", "Size help", "Talk to human"]
  };

  const styles = `
    .teviq-chat-button,
    .teviq-chat-window,
    .teviq-chat-window * {
      box-sizing: border-box;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .teviq-chat-button {
      position: fixed;
      width: 60px;
      height: 60px;
      border: 0;
      border-radius: 50%;
      background: var(--teviq-theme, #101828);
      color: #ffffff;
      box-shadow: 0 18px 45px rgba(16, 24, 40, 0.28);
      cursor: pointer;
      z-index: 2147483646;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0;
      transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
    }

    .teviq-chat-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 22px 52px rgba(16, 24, 40, 0.34);
      filter: brightness(1.08);
    }

    .teviq-chat-window {
      position: fixed;
      width: min(390px, calc(100vw - 32px));
      height: min(610px, calc(100vh - 124px));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(229, 231, 235, 0.95);
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
      z-index: 2147483646;
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px) scale(0.98);
      transform-origin: bottom right;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .teviq-position-bottom-right.teviq-chat-button {
      right: 22px;
      bottom: 22px;
    }

    .teviq-position-bottom-right.teviq-chat-window {
      right: 22px;
      bottom: 94px;
    }

    .teviq-position-bottom-left.teviq-chat-button {
      left: 22px;
      bottom: 22px;
    }

    .teviq-position-bottom-left.teviq-chat-window {
      left: 22px;
      bottom: 94px;
      transform-origin: bottom left;
    }

    .teviq-chat-window.is-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .teviq-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      background: var(--teviq-theme, #101828);
      color: #ffffff;
    }

    .teviq-chat-brand {
      display: flex;
      align-items: center;
      gap: 11px;
      min-width: 0;
    }

    .teviq-chat-avatar {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 8px;
      background: #ffffff;
      color: var(--teviq-theme, #101828);
      font-size: 13px;
      font-weight: 900;
    }

    .teviq-chat-title-wrap {
      min-width: 0;
    }

    .teviq-chat-title {
      margin: 0;
      overflow: hidden;
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .teviq-chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      color: #d1fae5;
      font-size: 12px;
      line-height: 1.2;
    }

    .teviq-chat-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.18);
    }

    .teviq-chat-close {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      transition: background 160ms ease;
    }

    .teviq-chat-close:hover {
      background: rgba(255, 255, 255, 0.14);
    }

    .teviq-chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
    }

    .teviq-chat-message {
      max-width: 84%;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .teviq-chat-message.user {
      align-self: flex-end;
      background: var(--teviq-theme, #101828);
      color: #ffffff;
      border-bottom-right-radius: 3px;
    }

    .teviq-chat-message.bot {
      align-self: flex-start;
      background: #ffffff;
      color: #111827;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 3px;
    }

    .teviq-chat-message.error {
      border-color: #fecaca;
      background: #fef2f2;
      color: #991b1b;
    }

    .teviq-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 2px;
    }

    .teviq-quick-reply {
      max-width: 100%;
      border: 1px solid #d0d5dd;
      border-radius: 999px;
      background: #ffffff;
      color: #111827;
      cursor: pointer;
      padding: 8px 11px;
      font-size: 13px;
      line-height: 1.1;
      transition: border 160ms ease, color 160ms ease, transform 160ms ease;
    }

    .teviq-quick-reply:hover:not(:disabled) {
      border-color: var(--teviq-theme, #101828);
      color: var(--teviq-theme, #101828);
      transform: translateY(-1px);
    }

    .teviq-quick-reply:disabled {
      cursor: not-allowed;
      opacity: 0.58;
    }

    .teviq-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 38px;
      height: 18px;
    }

    .teviq-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #667085;
      animation: teviqTyping 900ms infinite ease-in-out;
    }

    .teviq-typing span:nth-child(2) {
      animation-delay: 120ms;
    }

    .teviq-typing span:nth-child(3) {
      animation-delay: 240ms;
    }

    @keyframes teviqTyping {
      0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.45;
      }
      40% {
        transform: translateY(-4px);
        opacity: 1;
      }
    }

    .teviq-chat-form {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .teviq-chat-input {
      flex: 1;
      min-width: 0;
      height: 44px;
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      padding: 0 13px;
      color: #111827;
      font-size: 14px;
      outline: none;
      transition: border 160ms ease, box-shadow 160ms ease;
    }

    .teviq-chat-input:focus {
      border-color: var(--teviq-theme, #101828);
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.08);
    }

    .teviq-chat-send {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 8px;
      background: var(--teviq-theme, #101828);
      color: #ffffff;
      cursor: pointer;
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
      transition: opacity 160ms ease, transform 160ms ease, filter 160ms ease;
    }

    .teviq-chat-send:hover:not(:disabled) {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .teviq-chat-send:disabled {
      cursor: not-allowed;
      opacity: 0.52;
      transform: none;
    }

    @media (max-width: 520px) {
      .teviq-position-bottom-right.teviq-chat-button,
      .teviq-position-bottom-left.teviq-chat-button {
        right: 16px;
        left: auto;
        bottom: 16px;
      }

      .teviq-position-bottom-right.teviq-chat-window,
      .teviq-position-bottom-left.teviq-chat-window {
        right: 12px;
        left: 12px;
        bottom: 84px;
        width: auto;
        height: min(620px, calc(100vh - 104px));
        transform-origin: bottom right;
      }

      .teviq-chat-message {
        max-width: 88%;
      }
    }
  `;

  function injectStyles() {
    if (document.getElementById("teviq-chat-styles")) return;
    const styleTag = document.createElement("style");
    styleTag.id = "teviq-chat-styles";
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function appendMessage(messages, role, text, extraClass) {
    const className = ["teviq-chat-message", role, extraClass]
      .filter(Boolean)
      .join(" ");
    const message = createElement("div", className);
    if (text) message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function appendTyping(messages) {
    const bubble = appendMessage(messages, "bot");
    bubble.innerHTML =
      '<span class="teviq-typing" aria-label="Bot is typing"><span></span><span></span><span></span></span>';
    return bubble;
  }

  function getCustomerId() {
    const key = `teviq_support_customer_id_${brandId}`;
    let customerId = window.localStorage.getItem(key);
    if (!customerId) {
      customerId = `guest_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(key, customerId);
    }
    return customerId;
  }

  async function fetchBrandConfig() {
    try {
      const response = await fetch(
        `${normalizedApiUrl}/api/brand-config/${encodeURIComponent(brandId)}`
      );
      if (!response.ok) throw new Error("Brand config unavailable");
      return { ...fallbackConfig, ...(await response.json()) };
    } catch (error) {
      return fallbackConfig;
    }
  }

  async function sendMessage(message) {
    const response = await fetch(`${normalizedApiUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId,
        message,
        customerId: getCustomerId()
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.reply || "Support request failed.");
    }

    return data;
  }

  function setBusy(input, send, quickReplies, isBusy) {
    input.disabled = isBusy;
    send.disabled = isBusy;
    quickReplies
      .querySelectorAll("button")
      .forEach((button) => {
        button.disabled = isBusy;
      });
  }

  function renderQuickReplies(container, replies, submitMessage) {
    container.innerHTML = "";

    replies.slice(0, 6).forEach((reply) => {
      const chip = createElement("button", "teviq-quick-reply", reply);
      chip.type = "button";
      chip.addEventListener("click", () => submitMessage(reply));
      container.appendChild(chip);
    });
  }

  async function mountWidget() {
    injectStyles();
    const config = await fetchBrandConfig();
    const positionClass =
      config.position === "bottom-left"
        ? "teviq-position-bottom-left"
        : "teviq-position-bottom-right";

    const button = createElement(
      "button",
      `teviq-chat-button ${positionClass}`,
      "AI"
    );
    button.type = "button";
    button.setAttribute("aria-label", "Open support chat");
    button.style.setProperty("--teviq-theme", config.themeColor);

    const windowEl = createElement(
      "section",
      `teviq-chat-window ${positionClass}`
    );
    windowEl.setAttribute("aria-label", `${config.brandName} support chat`);
    windowEl.style.setProperty("--teviq-theme", config.themeColor);

    const header = createElement("header", "teviq-chat-header");
    const brandWrap = createElement("div", "teviq-chat-brand");
    const avatar = createElement(
      "div",
      "teviq-chat-avatar",
      config.brandName.charAt(0).toUpperCase()
    );
    const titleWrap = createElement("div", "teviq-chat-title-wrap");
    const title = createElement("h2", "teviq-chat-title", config.widgetTitle);
    const status = createElement("div", "teviq-chat-status");
    const statusDot = createElement("span", "teviq-chat-status-dot");
    const statusText = createElement("span", "", "Online support");
    status.append(statusDot, statusText);
    titleWrap.append(title, status);
    brandWrap.append(avatar, titleWrap);

    const close = createElement("button", "teviq-chat-close", "x");
    close.type = "button";
    close.setAttribute("aria-label", "Close support chat");
    header.append(brandWrap, close);

    const messages = createElement("div", "teviq-chat-messages");
    appendMessage(messages, "bot", config.welcomeMessage);

    const quickReplies = createElement("div", "teviq-quick-replies");
    messages.appendChild(quickReplies);

    const form = createElement("form", "teviq-chat-form");
    const input = createElement("input", "teviq-chat-input");
    input.type = "text";
    input.placeholder = "Ask about orders, returns, size...";
    input.autocomplete = "off";
    const send = createElement("button", "teviq-chat-send", ">");
    send.type = "submit";
    send.setAttribute("aria-label", "Send message");
    form.append(input, send);

    windowEl.append(header, messages, form);
    document.body.append(windowEl, button);

    function openWidget() {
      windowEl.classList.add("is-open");
      window.setTimeout(() => input.focus(), 180);
    }

    function closeWidget() {
      windowEl.classList.remove("is-open");
    }

    async function submitMessage(text) {
      const cleanText = text.trim();
      if (!cleanText || send.disabled) return;

      appendMessage(messages, "user", cleanText);
      input.value = "";
      setBusy(input, send, quickReplies, true);
      const pending = appendTyping(messages);

      try {
        const data = await sendMessage(cleanText);
        pending.textContent = data.reply || "Sorry, I could not understand that.";
      } catch (error) {
        pending.textContent =
          error.message ||
          "Sorry, support is unavailable right now. Please try again.";
        pending.classList.add("error");
      } finally {
        setBusy(input, send, quickReplies, false);
        input.focus();
      }
    }

    renderQuickReplies(quickReplies, config.quickReplies || [], submitMessage);

    button.addEventListener("click", () => {
      if (windowEl.classList.contains("is-open")) {
        closeWidget();
      } else {
        openWidget();
      }
    });

    close.addEventListener("click", closeWidget);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitMessage(input.value);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
})();
