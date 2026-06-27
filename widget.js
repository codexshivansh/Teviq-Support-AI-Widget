(function () {
  "use strict";

  const currentScript = document.currentScript;
  const brandId = currentScript?.getAttribute("data-brand-id") || "vastra-demo";
  const apiUrl =
    currentScript?.getAttribute("data-api-url") ||
    "https://teviq-support-ai-backend.onrender.com";
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");

  function getBrandName(id) {
    if (id === "vastra-demo") return "Teviq Vastra Demo";
    return id
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function getInitials(name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name[0];
    return initials.toUpperCase();
  }

  function normalizeHexColor(color) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color || "")) return "#101828";
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return color;
  }

  function hexToRgb(color) {
    const hex = normalizeHexColor(color).replace("#", "");
    const value = parseInt(hex, 16);
    return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
  }

  function formatTime() {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date());
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
      letter-spacing: 0;
    }

    .teviq-chat-button {
      position: fixed;
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background:
        radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.35), transparent 34%),
        linear-gradient(145deg, var(--teviq-theme, #101828), #101828);
      color: #ffffff;
      box-shadow: 0 22px 58px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.18);
      cursor: pointer;
      z-index: 2147483646;
      font-size: 16px;
      font-weight: 900;
      line-height: 1;
      transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
    }

    .teviq-chat-button::after {
      content: "";
      position: absolute;
      right: 7px;
      top: 8px;
      width: 13px;
      height: 13px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.14);
    }

    .teviq-chat-button:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 28px 70px rgba(15, 23, 42, 0.34), 0 0 0 1px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.24);
      filter: saturate(1.06);
    }

    .teviq-chat-button:active {
      transform: translateY(-1px) scale(0.98);
    }

    .teviq-chat-window {
      position: fixed;
      width: min(410px, calc(100vw - 28px));
      height: min(650px, calc(100dvh - 116px));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 24px;
      background: rgba(248, 250, 252, 0.9);
      box-shadow: 0 34px 90px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.05);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      z-index: 2147483646;
      opacity: 0;
      pointer-events: none;
      transform: translateY(18px) scale(0.96);
      transform-origin: bottom right;
      transition: opacity 210ms ease, transform 210ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .teviq-position-bottom-right.teviq-chat-button {
      right: calc(22px + env(safe-area-inset-right));
      bottom: calc(22px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-right.teviq-chat-window {
      right: calc(22px + env(safe-area-inset-right));
      bottom: calc(98px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-left.teviq-chat-button {
      left: calc(22px + env(safe-area-inset-left));
      bottom: calc(22px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-left.teviq-chat-window {
      left: calc(22px + env(safe-area-inset-left));
      bottom: calc(98px + env(safe-area-inset-bottom));
      transform-origin: bottom left;
    }

    .teviq-chat-window.is-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .teviq-chat-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 17px 18px;
      background:
        radial-gradient(circle at 92% 12%, rgba(255, 255, 255, 0.18), transparent 34%),
        linear-gradient(135deg, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.98), #111827);
      color: #ffffff;
    }

    .teviq-chat-header::after {
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.36), transparent);
    }

    .teviq-chat-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .teviq-chat-avatar {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.38);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.92);
      color: var(--teviq-theme, #101828);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 22px rgba(0, 0, 0, 0.14);
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
      font-weight: 850;
      line-height: 1.24;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .teviq-chat-status {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.82);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
    }

    .teviq-chat-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
    }

    .teviq-chat-close {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      cursor: pointer;
      font-size: 21px;
      line-height: 1;
      transition: background 160ms ease, transform 160ms ease;
    }

    .teviq-chat-close:hover {
      background: rgba(255, 255, 255, 0.17);
      transform: rotate(4deg);
    }

    .teviq-chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      overflow-y: auto;
      scroll-behavior: smooth;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(248, 250, 252, 0.9)),
        radial-gradient(circle at 0 0, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.08), transparent 36%);
    }

    .teviq-chat-messages::-webkit-scrollbar {
      width: 8px;
    }

    .teviq-chat-messages::-webkit-scrollbar-thumb {
      border: 2px solid transparent;
      border-radius: 999px;
      background: rgba(100, 116, 139, 0.35);
      background-clip: padding-box;
    }

    .teviq-welcome-card {
      padding: 15px;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
      animation: teviqMessageIn 220ms ease both;
    }

    .teviq-welcome-title {
      margin: 0 0 7px;
      color: #0f172a;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.35;
    }

    .teviq-welcome-copy {
      margin: 0;
      color: #64748b;
      font-size: 13px;
      line-height: 1.45;
    }

    .teviq-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 13px;
    }

    .teviq-quick-reply {
      max-width: 100%;
      border: 1px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.16);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      color: #1f2937;
      cursor: pointer;
      padding: 8px 11px;
      font-size: 12.5px;
      font-weight: 750;
      line-height: 1.15;
      transition: background 160ms ease, border 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }

    .teviq-quick-reply:hover:not(:disabled) {
      border-color: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.35);
      background: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.08);
      color: var(--teviq-theme, #101828);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      transform: translateY(-2px);
    }

    .teviq-quick-reply:disabled {
      cursor: not-allowed;
      opacity: 0.58;
      transform: none;
    }

    .teviq-chat-message-row {
      display: flex;
      flex-direction: column;
      max-width: 84%;
      animation: teviqMessageIn 220ms ease both;
    }

    .teviq-chat-message-row.user {
      align-self: flex-end;
      align-items: flex-end;
    }

    .teviq-chat-message-row.bot {
      align-self: flex-start;
      align-items: flex-start;
    }

    .teviq-chat-message {
      padding: 11px 13px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .teviq-chat-message.user {
      border-bottom-right-radius: 6px;
      background: linear-gradient(135deg, var(--teviq-theme, #101828), #111827);
      color: #ffffff;
      box-shadow: 0 12px 24px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.2);
    }

    .teviq-chat-message.bot {
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-bottom-left-radius: 6px;
      background: rgba(255, 255, 255, 0.94);
      color: #111827;
      box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
    }

    .teviq-chat-message.error {
      border-color: rgba(251, 191, 36, 0.52);
      background: #fffbeb;
      color: #78350f;
    }

    .teviq-chat-time {
      margin-top: 4px;
      padding: 0 4px;
      color: #94a3b8;
      font-size: 10.5px;
      line-height: 1.2;
    }

    .teviq-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 42px;
      height: 18px;
    }

    .teviq-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--teviq-theme, #101828);
      animation: teviqTyping 920ms infinite ease-in-out;
      opacity: 0.45;
    }

    .teviq-typing span:nth-child(2) {
      animation-delay: 120ms;
    }

    .teviq-typing span:nth-child(3) {
      animation-delay: 240ms;
    }

    .teviq-powered {
      padding: 0 16px 10px;
      background: rgba(248, 250, 252, 0.9);
      color: #94a3b8;
      font-size: 11px;
      font-weight: 650;
      text-align: center;
    }

    .teviq-powered strong {
      color: #475569;
      font-weight: 850;
    }

    .teviq-chat-form {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px 14px;
      border-top: 1px solid rgba(226, 232, 240, 0.82);
      background: rgba(255, 255, 255, 0.94);
    }

    .teviq-chat-input {
      flex: 1;
      min-width: 0;
      height: 46px;
      border: 1px solid rgba(203, 213, 225, 0.95);
      border-radius: 15px;
      padding: 0 14px;
      background: #ffffff;
      color: #0f172a;
      font-size: 14px;
      outline: none;
      transition: border 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .teviq-chat-input::placeholder {
      color: #94a3b8;
    }

    .teviq-chat-input:focus {
      border-color: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.54);
      box-shadow: 0 0 0 4px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.1);
    }

    .teviq-chat-input:disabled {
      cursor: wait;
      background: #f8fafc;
    }

    .teviq-chat-send {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 15px;
      background: linear-gradient(135deg, var(--teviq-theme, #101828), #111827);
      color: #ffffff;
      cursor: pointer;
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
      box-shadow: 0 12px 26px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.22);
      transition: opacity 160ms ease, transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
    }

    .teviq-chat-send:hover:not(:disabled) {
      filter: brightness(1.06);
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.28);
    }

    .teviq-chat-send:active:not(:disabled) {
      transform: translateY(0) scale(0.96);
    }

    .teviq-chat-send:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      transform: none;
      box-shadow: none;
    }

    .teviq-chat-button:focus-visible,
    .teviq-chat-close:focus-visible,
    .teviq-chat-send:focus-visible,
    .teviq-quick-reply:focus-visible,
    .teviq-chat-input:focus-visible {
      outline: 3px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.24);
      outline-offset: 3px;
    }

    @keyframes teviqTyping {
      0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.42;
      }
      40% {
        transform: translateY(-4px);
        opacity: 1;
      }
    }

    @keyframes teviqMessageIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 520px) {
      .teviq-position-bottom-right.teviq-chat-button,
      .teviq-position-bottom-left.teviq-chat-button {
        right: calc(16px + env(safe-area-inset-right));
        left: auto;
        bottom: calc(16px + env(safe-area-inset-bottom));
      }

      .teviq-position-bottom-right.teviq-chat-window,
      .teviq-position-bottom-left.teviq-chat-window {
        right: calc(10px + env(safe-area-inset-right));
        left: calc(10px + env(safe-area-inset-left));
        bottom: calc(88px + env(safe-area-inset-bottom));
        width: auto;
        height: min(620px, calc(100dvh - 106px));
        border-radius: 22px;
        transform-origin: bottom right;
      }

      .teviq-chat-header {
        padding: 15px;
      }

      .teviq-chat-messages {
        padding: 14px;
      }

      .teviq-chat-message-row {
        max-width: 88%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .teviq-chat-button,
      .teviq-chat-window,
      .teviq-chat-close,
      .teviq-chat-send,
      .teviq-quick-reply,
      .teviq-chat-message-row,
      .teviq-welcome-card,
      .teviq-typing span {
        animation: none;
        transition: none;
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

  function applyTheme(element, color) {
    const theme = normalizeHexColor(color);
    element.style.setProperty("--teviq-theme", theme);
    element.style.setProperty("--teviq-theme-rgb", hexToRgb(theme));
  }

  function scrollToBottom(messages) {
    messages.scrollTo({
      top: messages.scrollHeight,
      behavior: "smooth"
    });
  }

  function appendMessage(messages, role, text, extraClass) {
    const row = createElement("div", `teviq-chat-message-row ${role}`);
    const bubble = createElement(
      "div",
      ["teviq-chat-message", role, extraClass].filter(Boolean).join(" ")
    );
    if (text) bubble.textContent = text;

    const time = createElement("div", "teviq-chat-time", formatTime());
    row.append(bubble, time);
    messages.appendChild(row);
    scrollToBottom(messages);
    return bubble;
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
      throw new Error(data?.reply || "Could not connect. Please try again.");
    }

    return data;
  }

  function setBusy(input, send, quickReplies, isBusy) {
    input.disabled = isBusy;
    send.disabled = isBusy;
    input.setAttribute("aria-busy", String(isBusy));
    quickReplies.querySelectorAll("button").forEach((button) => {
      button.disabled = isBusy;
    });
  }

  function renderQuickReplies(container, replies, submitMessage) {
    container.innerHTML = "";

    replies.slice(0, 6).forEach((reply) => {
      const chip = createElement("button", "teviq-quick-reply", reply);
      chip.type = "button";
      chip.setAttribute("aria-label", `Send quick reply: ${reply}`);
      chip.addEventListener("click", () => submitMessage(reply));
      container.appendChild(chip);
    });
  }

  function renderWelcome(messages, config, submitMessage) {
    const card = createElement("section", "teviq-welcome-card");
    const title = createElement("p", "teviq-welcome-title", config.welcomeMessage);
    const copy = createElement(
      "p",
      "teviq-welcome-copy",
      "Ask about orders, returns, shipping, or products."
    );
    const quickReplies = createElement("div", "teviq-quick-replies");

    card.append(title, copy, quickReplies);
    messages.appendChild(card);
    renderQuickReplies(quickReplies, config.quickReplies || [], submitMessage);
    return quickReplies;
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
    button.setAttribute("aria-label", `Open ${config.brandName} support chat`);
    applyTheme(button, config.themeColor);

    const windowEl = createElement(
      "section",
      `teviq-chat-window ${positionClass}`
    );
    windowEl.setAttribute("aria-label", `${config.brandName} support chat`);
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-live", "polite");
    applyTheme(windowEl, config.themeColor);

    const header = createElement("header", "teviq-chat-header");
    const brandWrap = createElement("div", "teviq-chat-brand");
    const avatar = createElement(
      "div",
      "teviq-chat-avatar",
      getInitials(config.brandName)
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

    const powered = createElement("div", "teviq-powered");
    powered.innerHTML = "Powered by <strong>Teviq</strong>";

    const form = createElement("form", "teviq-chat-form");
    const input = createElement("input", "teviq-chat-input");
    input.type = "text";
    input.placeholder = "Ask about orders, returns, size...";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Type your support message");
    const send = createElement("button", "teviq-chat-send", ">");
    send.type = "submit";
    send.setAttribute("aria-label", "Send message");
    form.append(input, send);

    windowEl.append(header, messages, powered, form);
    document.body.append(windowEl, button);

    function openWidget() {
      windowEl.classList.add("is-open");
      button.setAttribute("aria-label", `Close ${config.brandName} support chat`);
      window.setTimeout(() => input.focus(), 180);
    }

    function closeWidget() {
      windowEl.classList.remove("is-open");
      button.setAttribute("aria-label", `Open ${config.brandName} support chat`);
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
        pending.textContent = "Could not connect. Please try again.";
        pending.classList.add("error");
      } finally {
        scrollToBottom(messages);
        setBusy(input, send, quickReplies, false);
        input.focus();
      }
    }

    const quickReplies = renderWelcome(messages, config, submitMessage);

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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && windowEl.classList.contains("is-open")) {
        closeWidget();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
})();
