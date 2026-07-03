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

    .teviq-chat-window header,
    .teviq-chat-window section,
    .teviq-chat-window form,
    .teviq-chat-window h2,
    .teviq-chat-window h3,
    .teviq-chat-window p {
      max-width: none;
      margin: 0;
      padding-left: 0;
      padding-right: 0;
    }

    .teviq-chat-button,
    .teviq-chat-window {
      --teviq-ease: cubic-bezier(0.16, 1, 0.3, 1);
      --teviq-spring: cubic-bezier(0.2, 0.9, 0.2, 1.18);
      --teviq-surface: rgba(255, 255, 255, 0.78);
      --teviq-border: rgba(255, 255, 255, 0.66);
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    .teviq-chat-button {
      position: fixed;
      width: 56px;
      height: 56px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0)),
        linear-gradient(145deg, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.98), #0b1220);
      color: #ffffff;
      box-shadow:
        0 1px 1px rgba(15, 23, 42, 0.08),
        0 12px 28px rgba(15, 23, 42, 0.18),
        0 24px 54px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      cursor: pointer;
      z-index: 2147483646;
      font-size: 16px;
      font-weight: 900;
      line-height: 1;
      will-change: transform, box-shadow;
      transition: transform 260ms var(--teviq-spring), box-shadow 260ms var(--teviq-ease), filter 260ms var(--teviq-ease);
    }

    .teviq-chat-button::after {
      content: "";
      position: absolute;
      right: 7px;
      top: 8px;
      width: 12px;
      height: 12px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
    }

    .teviq-chat-button:hover {
      transform: translate3d(0, -4px, 0) scale(1.035);
      box-shadow:
        0 2px 2px rgba(15, 23, 42, 0.08),
        0 18px 36px rgba(15, 23, 42, 0.18),
        0 34px 72px rgba(15, 23, 42, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.28);
      filter: saturate(1.03);
    }

    .teviq-chat-button:active {
      transform: translate3d(0, -1px, 0) scale(0.965);
    }

    .teviq-chat-window {
      position: fixed;
      width: min(396px, calc(100vw - 24px));
      height: min(600px, calc(100dvh - 120px));
      max-height: calc(100dvh - 120px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
      border: 1px solid var(--teviq-border);
      border-radius: 22px;
      background: var(--teviq-surface);
      box-shadow:
        0 1px 1px rgba(15, 23, 42, 0.04),
        0 12px 34px rgba(15, 23, 42, 0.1),
        0 34px 90px rgba(15, 23, 42, 0.18),
        0 0 0 1px rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(24px) saturate(1.18);
      -webkit-backdrop-filter: blur(24px) saturate(1.18);
      z-index: 2147483646;
      opacity: 0;
      pointer-events: none;
      transform: translate3d(0, 18px, 0) scale(0.96);
      transform-origin: bottom right;
      will-change: opacity, transform, filter;
      filter: blur(8px);
      transition:
        opacity 260ms var(--teviq-ease),
        transform 320ms var(--teviq-spring),
        filter 260ms var(--teviq-ease);
    }

    .teviq-position-bottom-right.teviq-chat-button {
      right: calc(22px + env(safe-area-inset-right));
      bottom: calc(22px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-right.teviq-chat-window {
      right: calc(22px + env(safe-area-inset-right));
      bottom: calc(86px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-left.teviq-chat-button {
      left: calc(22px + env(safe-area-inset-left));
      bottom: calc(22px + env(safe-area-inset-bottom));
    }

    .teviq-position-bottom-left.teviq-chat-window {
      left: calc(22px + env(safe-area-inset-left));
      bottom: calc(86px + env(safe-area-inset-bottom));
      transform-origin: bottom left;
    }

    .teviq-chat-window.is-open {
      opacity: 1;
      pointer-events: auto;
      transform: translate3d(0, 0, 0) scale(1);
      filter: blur(0);
    }

    .teviq-chat-header {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 0 0 auto;
      gap: 10px;
      min-height: 60px;
      padding: 10px 12px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent),
        linear-gradient(135deg, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.96), #111827);
      color: #ffffff;
    }

    .teviq-chat-window .teviq-chat-header {
      width: 100%;
      margin: 0;
      padding: 10px 12px;
    }

    .teviq-chat-header::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.36), transparent);
    }

    .teviq-chat-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1 1 auto;
      min-width: 0;
    }

    .teviq-chat-avatar {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.38);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.94);
      color: var(--teviq-theme, #101828);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 12px 24px rgba(0, 0, 0, 0.12);
      font-size: 11px;
      font-weight: 900;
    }

    .teviq-chat-title-wrap {
      flex: 1 1 auto;
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
      margin-top: 3px;
      color: rgba(255, 255, 255, 0.82);
      font-size: 11.5px;
      font-weight: 650;
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
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 11px;
      background: rgba(255, 255, 255, 0.065);
      color: #ffffff;
      cursor: pointer;
      font-size: 21px;
      line-height: 1;
      transition: background 220ms var(--teviq-ease), transform 220ms var(--teviq-spring), border-color 220ms var(--teviq-ease);
    }

    .teviq-chat-close svg {
      width: 16px;
      height: 16px;
    }

    .teviq-chat-close:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.04);
    }

    .teviq-chat-messages {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 9px;
      padding: 10px;
      overflow-y: auto;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 116, 139, 0.22) transparent;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.82)),
        radial-gradient(circle at 0 0, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.055), transparent 38%);
      overscroll-behavior: contain;
    }

    .teviq-chat-messages::-webkit-scrollbar {
      width: 5px;
    }

    .teviq-chat-messages::-webkit-scrollbar-thumb {
      border: 1px solid transparent;
      border-radius: 999px;
      background: rgba(100, 116, 139, 0.22);
      background-clip: padding-box;
    }

    .teviq-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 8px;
    }

    .teviq-quick-replies.is-archived {
      display: none;
    }

    .teviq-quick-reply {
      position: relative;
      overflow: hidden;
      isolation: isolate;
      max-width: 100%;
      border: 1px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.12);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.78);
      color: #1f2937;
      cursor: pointer;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.15;
      box-shadow: 0 1px 1px rgba(15, 23, 42, 0.03);
      transition:
        background 240ms var(--teviq-ease),
        border 240ms var(--teviq-ease),
        color 240ms var(--teviq-ease),
        transform 240ms var(--teviq-spring),
        box-shadow 240ms var(--teviq-ease);
      will-change: transform;
    }

    .teviq-quick-reply::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.14), transparent 60%);
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 260ms var(--teviq-ease), transform 260ms var(--teviq-ease);
      pointer-events: none;
      z-index: 0;
    }

    .teviq-quick-reply span {
      position: relative;
      z-index: 1;
    }

    .teviq-quick-reply:hover:not(:disabled) {
      border-color: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.22);
      background: rgba(255, 255, 255, 0.96);
      color: var(--teviq-theme, #101828);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      transform: translate3d(0, -2px, 0);
    }

    .teviq-quick-reply:hover:not(:disabled)::after {
      opacity: 1;
      transform: scale(1.8);
    }

    .teviq-quick-reply:disabled {
      cursor: not-allowed;
      opacity: 0.58;
      transform: none;
    }

    .teviq-suggestions {
      width: 100%;
      display: none;
      flex-direction: column;
      gap: 6px;
      opacity: 0;
      transform: translate3d(0, 6px, 0);
      transition: opacity 220ms var(--teviq-ease), transform 220ms var(--teviq-ease);
    }

    .teviq-suggestions.is-visible {
      display: flex;
      opacity: 1;
      transform: translate3d(0, 0, 0);
      animation: teviqSuggestionsIn 220ms var(--teviq-ease) both;
    }

    .teviq-suggestions.is-refreshing .teviq-suggestion-chip {
      animation: teviqSuggestionsIn 180ms var(--teviq-ease) both;
    }

    .teviq-suggestions-label {
      color: #94a3b8;
      font-size: 9.5px;
      font-weight: 760;
      line-height: 1;
      text-transform: uppercase;
    }

    .teviq-suggestion-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .teviq-suggestion-chip {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.1);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.66);
      color: #334155;
      cursor: pointer;
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 720;
      line-height: 1;
      transition:
        background 180ms var(--teviq-ease),
        border 180ms var(--teviq-ease),
        color 180ms var(--teviq-ease),
        transform 180ms var(--teviq-spring);
    }

    .teviq-suggestion-chip:hover:not(:disabled) {
      border-color: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.2);
      background: rgba(255, 255, 255, 0.92);
      color: var(--teviq-theme, #101828);
      transform: translate3d(0, -1px, 0);
    }

    .teviq-suggestion-chip:disabled {
      cursor: not-allowed;
      opacity: 0.58;
    }

    .teviq-chat-message-row {
      display: flex;
      flex-direction: column;
      max-width: 92%;
      animation: teviqMessageIn 320ms var(--teviq-ease) both;
      animation-delay: var(--teviq-stagger, 0ms);
      will-change: opacity, transform;
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
      padding: 10px 12px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.45;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .teviq-chat-message.user {
      border-bottom-right-radius: 6px;
      background: linear-gradient(135deg, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.98), #111827);
      color: #ffffff;
      box-shadow: 0 10px 24px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.18);
    }

    .teviq-chat-message.bot {
      border: 1px solid rgba(226, 232, 240, 0.72);
      border-bottom-left-radius: 6px;
      background: rgba(255, 255, 255, 0.88);
      color: #111827;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.045);
    }

    .teviq-chat-message-row.bot.teviq-card-row {
      max-width: 100%;
      width: 100%;
    }

    .teviq-chat-message.teviq-card-host {
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      white-space: normal;
    }

    .teviq-card-stack {
      display: flex;
      flex-direction: column;
      gap: 9px;
      width: 100%;
    }

    .teviq-support-card {
      position: relative;
      overflow: hidden;
      width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid rgba(226, 232, 240, 0.78);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.9);
      box-shadow:
        0 1px 1px rgba(15, 23, 42, 0.03),
        0 14px 34px rgba(15, 23, 42, 0.07);
      animation: teviqCardIn 360ms var(--teviq-ease) both;
      will-change: opacity, transform;
    }

    .teviq-support-card + .teviq-support-card {
      animation-delay: 80ms;
    }

    .teviq-card-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 13px;
    }

    .teviq-card-topline {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .teviq-card-title-wrap {
      min-width: 0;
    }

    .teviq-card-kicker {
      margin: 0 0 4px;
      color: #64748b;
      font-size: 10px;
      font-weight: 780;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .teviq-card-title {
      margin: 0;
      color: #0f172a;
      font-size: 14px;
      font-weight: 790;
      line-height: 1.34;
    }

    .teviq-card-welcome .teviq-card-topline {
      align-items: center;
    }

    .teviq-card-welcome .teviq-card-title {
      font-size: 14px;
      line-height: 1.28;
    }

    .teviq-card-error .teviq-card-inner,
    .teviq-card-human .teviq-card-inner,
    .teviq-card-lead .teviq-card-inner,
    .teviq-card-return-rejected .teviq-card-inner {
      gap: 8px;
      padding: 12px;
    }

    .teviq-card-error .teviq-card-copy,
    .teviq-card-human .teviq-card-copy,
    .teviq-card-lead .teviq-card-copy,
    .teviq-card-return-rejected .teviq-card-copy {
      line-height: 1.4;
    }

    .teviq-card-copy {
      margin: 0;
      color: #475569;
      font-size: 12.75px;
      line-height: 1.45;
    }

    .teviq-card-badge {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(148, 163, 184, 0.26);
      border-radius: 999px;
      padding: 4px 6px;
      background: #f8fafc;
      color: #475569;
      font-size: 10px;
      font-weight: 780;
      line-height: 1;
      white-space: nowrap;
    }

    .teviq-card-badge.success {
      border-color: rgba(22, 163, 74, 0.18);
      background: #f0fdf4;
      color: #15803d;
    }

    .teviq-card-badge.warning {
      border-color: rgba(217, 119, 6, 0.2);
      background: #fffbeb;
      color: #b45309;
    }

    .teviq-card-badge.danger {
      border-color: rgba(220, 38, 38, 0.18);
      background: #fef2f2;
      color: #b91c1c;
    }

    .teviq-card-badge.info {
      border-color: rgba(37, 99, 235, 0.16);
      background: #eff6ff;
      color: #1d4ed8;
    }

    .teviq-card-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .teviq-card-stat {
      min-width: 0;
      border: 1px solid rgba(226, 232, 240, 0.72);
      border-radius: 13px;
      padding: 8px;
      background: rgba(248, 250, 252, 0.76);
    }

    .teviq-card-label {
      margin: 0 0 4px;
      color: #94a3b8;
      font-size: 10px;
      font-weight: 760;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .teviq-card-value {
      margin: 0;
      overflow: hidden;
      color: #0f172a;
      font-size: 12.5px;
      font-weight: 760;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .teviq-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-top: 2px;
    }

    .teviq-timeline-step {
      position: relative;
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 10px;
      min-height: 30px;
      color: #94a3b8;
    }

    .teviq-timeline-step:not(:last-child)::after {
      content: "";
      position: absolute;
      left: 6px;
      top: 17px;
      bottom: -3px;
      width: 1px;
      background: #e2e8f0;
    }

    .teviq-timeline-dot {
      position: relative;
      z-index: 1;
      width: 13px;
      height: 13px;
      margin-top: 2px;
      border: 2px solid #cbd5e1;
      border-radius: 50%;
      background: #ffffff;
    }

    .teviq-timeline-step.is-complete,
    .teviq-timeline-step.is-current {
      color: #0f172a;
    }

    .teviq-timeline-step.is-complete .teviq-timeline-dot {
      border-color: #16a34a;
      background: #16a34a;
    }

    .teviq-timeline-step.is-current .teviq-timeline-dot {
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
    }

    .teviq-timeline-title {
      margin: 0;
      color: inherit;
      font-size: 12.75px;
      font-weight: 760;
      line-height: 1.35;
    }

    .teviq-card-action {
      align-self: flex-start;
      border: 1px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.18);
      border-radius: 999px;
      padding: 7px 10px;
      background: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.06);
      color: var(--teviq-theme, #101828);
      font-size: 11.5px;
      font-weight: 780;
      line-height: 1;
    }

    .teviq-chat-message.error {
      border-color: rgba(251, 191, 36, 0.52);
      background: #fffbeb;
      color: #78350f;
    }

    .teviq-chat-time {
      margin-top: 5px;
      padding: 0 4px;
      color: #9aa7b7;
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
      animation: teviqTyping 1120ms infinite var(--teviq-ease);
      opacity: 0.45;
    }

    .teviq-typing span:nth-child(2) {
      animation-delay: 120ms;
    }

    .teviq-typing span:nth-child(3) {
      animation-delay: 240ms;
    }

    .teviq-powered {
      flex: 0 0 auto;
      width: 100%;
      min-height: 9px;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
      padding: 0;
      background: transparent;
      color: #94a3b8;
      font-size: 9px;
      font-weight: 600;
      line-height: 1;
      opacity: 0.45;
      text-align: center;
      white-space: nowrap;
    }

    .teviq-powered span,
    .teviq-powered strong {
      display: block;
      font-size: inherit;
      line-height: 1;
    }

    .teviq-powered strong {
      color: #475569;
      font-weight: 850;
      margin-left: 0;
      transform: translateY(0.4px);
    }

    .teviq-chat-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: 0 0 auto;
      gap: 8px;
      padding: 7px 10px 7px;
      border-top: 1px solid rgba(226, 232, 240, 0.58);
      background: rgba(255, 255, 255, 0.88);
    }

    .teviq-chat-window .teviq-chat-form {
      width: 100%;
      margin: 0;
      padding: 7px 10px 7px;
    }

    .teviq-composer-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .teviq-chat-input {
      flex: 1;
      min-width: 0;
      height: 42px;
      border: 1px solid rgba(203, 213, 225, 0.56);
      border-radius: 13px;
      padding: 0 13px;
      background: rgba(255, 255, 255, 0.82);
      color: #0f172a;
      font-size: 14px;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      transition: border 220ms var(--teviq-ease), box-shadow 220ms var(--teviq-ease), background 220ms var(--teviq-ease);
    }

    .teviq-chat-input::placeholder {
      color: #94a3b8;
    }

    .teviq-chat-input:focus {
      border-color: rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.24);
      background: #ffffff;
      box-shadow:
        0 0 0 2px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.035),
        0 8px 18px rgba(15, 23, 42, 0.04);
    }

    .teviq-chat-input:disabled {
      cursor: wait;
      background: #f8fafc;
    }

    .teviq-chat-send {
      position: relative;
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 13px;
      background: linear-gradient(135deg, rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.98), #111827);
      color: #ffffff;
      cursor: pointer;
      font-size: 0;
      line-height: 1;
      box-shadow:
        0 1px 1px rgba(15, 23, 42, 0.08),
        0 12px 24px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.2);
      transition:
        opacity 220ms var(--teviq-ease),
        transform 220ms var(--teviq-spring),
        filter 220ms var(--teviq-ease),
        box-shadow 220ms var(--teviq-ease);
      will-change: transform;
    }

    .teviq-chat-send svg {
      width: 17px;
      height: 17px;
      transition: opacity 180ms var(--teviq-ease), transform 220ms var(--teviq-spring);
    }

    .teviq-chat-send:hover:not(:disabled) {
      filter: brightness(1.04);
      transform: translate3d(0, -2px, 0);
      box-shadow:
        0 1px 1px rgba(15, 23, 42, 0.08),
        0 16px 30px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.26);
    }

    .teviq-chat-send:active:not(:disabled) {
      transform: translate3d(0, 0, 0) scale(0.94);
    }

    .teviq-chat-send:disabled {
      cursor: wait;
      opacity: 0.82;
      transform: none;
      box-shadow: 0 8px 18px rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.14);
    }

    .teviq-chat-send.is-loading svg {
      opacity: 0;
      transform: scale(0.7);
    }

    .teviq-chat-send.is-loading::after {
      content: "";
      position: absolute;
      width: 17px;
      height: 17px;
      border: 2px solid rgba(255, 255, 255, 0.34);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: teviqSpin 780ms linear infinite;
    }

    .teviq-chat-send.is-sent {
      animation: teviqSendSuccess 360ms var(--teviq-spring) both;
    }

    .teviq-chat-button:focus-visible,
    .teviq-chat-close:focus-visible,
    .teviq-chat-send:focus-visible,
    .teviq-quick-reply:focus-visible {
      outline: 2px solid rgba(var(--teviq-theme-rgb, 16, 24, 40), 0.18);
      outline-offset: 2px;
    }

    .teviq-chat-input:focus-visible {
      outline: none;
    }

    @keyframes teviqTyping {
      0%, 80%, 100% {
        transform: translate3d(0, 0, 0) scale(0.82);
        opacity: 0.42;
      }
      40% {
        transform: translate3d(0, -4px, 0) scale(1);
        opacity: 1;
      }
    }

    @keyframes teviqMessageIn {
      from {
        opacity: 0;
        transform: translate3d(0, 10px, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    @keyframes teviqCardIn {
      from {
        opacity: 0;
        transform: translate3d(0, 12px, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    @keyframes teviqSuggestionsIn {
      from {
        opacity: 0;
        transform: translate3d(0, 6px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes teviqSpin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes teviqSendSuccess {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.08);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 640px) {
      .teviq-position-bottom-right.teviq-chat-button,
      .teviq-position-bottom-left.teviq-chat-button {
        right: calc(16px + env(safe-area-inset-right));
        left: auto;
        bottom: calc(16px + env(safe-area-inset-bottom));
      }

      .teviq-position-bottom-right.teviq-chat-window,
      .teviq-position-bottom-left.teviq-chat-window {
        position: fixed;
        inset: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        height: var(--teviq-vh, 100dvh);
        max-height: none;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        transform-origin: bottom center;
      }

      .teviq-position-bottom-right.teviq-chat-window.is-open,
      .teviq-position-bottom-left.teviq-chat-window.is-open,
      .teviq-chat-window.teviq-mobile-open {
        position: fixed !important;
        inset: 0 !important;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        height: 100dvh !important;
        height: var(--teviq-vh, 100dvh) !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        transform: translate3d(0, 0, 0) scale(1) !important;
        filter: blur(0) !important;
      }

      .teviq-chat-window.is-open + .teviq-chat-button {
        opacity: 0;
        pointer-events: none;
        transform: translate3d(0, 8px, 0) scale(0.92);
      }

      .teviq-chat-header {
        position: sticky;
        top: 0;
        z-index: 2;
        min-height: calc(58px + env(safe-area-inset-top));
        padding: calc(10px + env(safe-area-inset-top)) 12px 10px;
      }

      .teviq-chat-window .teviq-chat-header {
        padding: calc(10px + env(safe-area-inset-top)) 12px 10px;
      }

      .teviq-chat-messages {
        flex: 1 1 auto;
        min-height: 0;
        padding: 10px;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .teviq-chat-message-row {
        max-width: 92%;
      }

      .teviq-chat-message-row.bot.teviq-card-row {
        max-width: 100%;
        width: 100%;
      }

      .teviq-card-inner {
        padding: 12px;
      }

      .teviq-card-topline {
        gap: 8px;
      }

      .teviq-card-badge {
        padding: 4px 6px;
      }

      .teviq-chat-form {
        position: sticky;
        bottom: 0;
        z-index: 2;
        padding: 7px 10px calc(8px + env(safe-area-inset-bottom));
      }

      .teviq-chat-window .teviq-chat-form {
        padding: 7px 10px calc(8px + env(safe-area-inset-bottom));
      }

      .teviq-powered {
        padding: 1px 0 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .teviq-chat-button,
      .teviq-chat-window,
      .teviq-chat-close,
      .teviq-chat-send,
      .teviq-chat-send svg,
      .teviq-chat-send.is-sent,
      .teviq-quick-reply,
      .teviq-quick-reply::after,
      .teviq-chat-message-row,
      .teviq-support-card,
      .teviq-suggestions,
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

  let messageIndex = 0;

  function appendMessage(messages, role, text, extraClass) {
    const row = createElement("div", `teviq-chat-message-row ${role}`);
    row.style.setProperty("--teviq-stagger", `${Math.min(messageIndex * 16, 80)}ms`);
    messageIndex += 1;
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

  function extractOrderId(text) {
    const match = String(text || "").match(/#?\b([A-Z]{2,6}\d{3,8})\b/i);
    return match ? match[1].toUpperCase() : null;
  }

  function extractStatus(text) {
    const value = String(text || "").toLowerCase();
    if (value.includes("out for delivery")) return "Out for Delivery";
    if (value.includes("delivered")) return "Delivered";
    if (value.includes("shipped")) return "Shipped";
    if (value.includes("processing")) return "Processing";
    if (value.includes("cancelled") || value.includes("canceled")) return "Cancelled";
    return null;
  }

  function getBadgeTone(status) {
    if (!status) return "info";
    const normalized = status.toLowerCase();
    if (normalized.includes("delivered") || normalized.includes("eligible")) return "success";
    if (normalized.includes("cancel") || normalized.includes("reject") || normalized.includes("not eligible")) return "danger";
    if (normalized.includes("processing") || normalized.includes("pending")) return "warning";
    return "info";
  }

  function isReturnRejected(reply) {
    const text = String(reply || "").toLowerCase();
    return (
      text.includes("not eligible") ||
      text.includes("cannot") ||
      text.includes("can't") ||
      text.includes("after delivery") ||
      text.includes("not delivered")
    );
  }

  function addText(parent, tag, className, text) {
    if (!text) return null;
    const element = createElement(tag, className, text);
    parent.appendChild(element);
    return element;
  }

  function createBadge(label, tone) {
    return createElement("span", `teviq-card-badge ${tone || "info"}`, label);
  }

  function createStat(label, value) {
    const stat = createElement("div", "teviq-card-stat");
    addText(stat, "p", "teviq-card-label", label);
    addText(stat, "p", "teviq-card-value", value || "Not available");
    return stat;
  }

  function createCard(options) {
    const card = createElement("section", `teviq-support-card ${options.kind || ""}`);
    const inner = createElement("div", "teviq-card-inner");
    const topline = createElement("div", "teviq-card-topline");
    const titleWrap = createElement("div", "teviq-card-title-wrap");

    addText(titleWrap, "p", "teviq-card-kicker", options.kicker);
    addText(titleWrap, "h3", "teviq-card-title", options.title);
    topline.appendChild(titleWrap);
    if (options.badge) topline.appendChild(createBadge(options.badge, options.badgeTone));
    inner.appendChild(topline);

    addText(inner, "p", "teviq-card-copy", options.body);

    if (options.stats?.length) {
      const grid = createElement("div", "teviq-card-grid");
      options.stats.forEach((stat) => grid.appendChild(createStat(stat.label, stat.value)));
      inner.appendChild(grid);
    }

    if (options.content) inner.appendChild(options.content);
    if (options.action) addText(inner, "div", "teviq-card-action", options.action);

    card.appendChild(inner);
    return card;
  }

  function createTimeline(status) {
    const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
    const currentIndex = Math.max(0, steps.findIndex((step) => step === status));
    const timeline = createElement("div", "teviq-timeline");

    steps.forEach((step, index) => {
      const state =
        status === "Cancelled"
          ? index === 0
            ? "is-current"
            : ""
          : index < currentIndex
            ? "is-complete"
            : index === currentIndex
              ? "is-current"
              : "";
      const row = createElement("div", `teviq-timeline-step ${state}`);
      const dot = createElement("span", "teviq-timeline-dot");
      const copy = createElement("div", "teviq-timeline-copy");
      addText(copy, "p", "teviq-timeline-title", step);
      row.append(dot, copy);
      timeline.appendChild(row);
    });

    return timeline;
  }

  const supportCards = {
    orderStatus(data, context) {
      const status = data.order?.status || extractStatus(data.reply);
      return createCard({
        kind: "teviq-card-order",
        kicker: "Order status",
        title: status
          ? `Your order is ${status}`
          : context.orderId
            ? "Order status could not be confirmed"
            : "Share your order ID",
        badge: status || (context.orderId ? "Status needed" : "Order ID needed"),
        badgeTone: getBadgeTone(status),
        body: data.reply,
        stats: [
          { label: "Order", value: data.order?.orderId || context.orderId || "Required" },
          { label: "Source", value: data.source || "Support Brain" }
        ]
      });
    },
    shippingTimeline(data) {
      const status = data.order?.status || extractStatus(data.reply);
      return createCard({
        kind: "teviq-card-timeline",
        kicker: "Shipping timeline",
        title: status === "Cancelled" ? "Order timeline paused" : "Current fulfillment stage",
        badge: status || "Pending",
        badgeTone: getBadgeTone(status),
        body:
          status === "Cancelled"
            ? "This order is marked cancelled, so fulfillment updates are no longer active."
            : "A quick visual snapshot of where this order sits right now.",
        content: createTimeline(status)
      });
    },
    returnEligibility(data, context) {
      const needsOrderId = !context.orderId && /order id|order number|share.*order/i.test(data.reply || "");
      return createCard({
        kind: "teviq-card-return-allowed",
        kicker: "Return eligibility",
        title: needsOrderId ? "Share your order ID to check" : "Return or exchange can be checked",
        badge: needsOrderId ? "Order needed" : "Eligible",
        badgeTone: needsOrderId ? "info" : "success",
        body: data.reply,
        stats: [
          { label: "Order", value: context.orderId || "Required" },
          { label: "Policy", value: "After delivery" }
        ]
      });
    },
    returnRejected(data, context) {
      return createCard({
        kind: "teviq-card-return-rejected",
        kicker: "Return eligibility",
        title: "Return is not available yet",
        badge: "Not eligible",
        badgeTone: "warning",
        body: data.reply,
        stats: [
          { label: "Order", value: context.orderId || "Order needed" },
          { label: "Reason", value: "Policy check" }
        ]
      });
    },
    refundStatus(data, context) {
      return createCard({
        kind: "teviq-card-refund",
        kicker: "Refund status",
        title: "Refund guidance",
        badge: "Policy-safe",
        badgeTone: "info",
        body: data.reply,
        stats: [
          { label: "Order", value: context.orderId || "If available" },
          { label: "Promise", value: "No confirmation invented" }
        ]
      });
    },
    humanSupport(data) {
      return createCard({
        kind: "teviq-card-human",
        kicker: data.escalated ? "Escalated" : "Human support",
        title: "A human can help from here",
        badge: data.escalated ? "Priority" : "Support",
        badgeTone: data.escalated ? "danger" : "info",
        body: data.reply,
        action: "Contact details included when available"
      });
    },
    leadCapture(data) {
      return createCard({
        kind: "teviq-card-lead",
        kicker: "Contact request",
        title: "Share your details to continue",
        badge: "Lead",
        badgeTone: "info",
        body: data.reply,
        action: "Name + phone or email"
      });
    },
    productRecommendation(data) {
      return createCard({
        kind: "teviq-card-product",
        kicker: "Product help",
        title: "Recommended next step",
        badge: "Personalized",
        badgeTone: "info",
        body: data.reply,
        action: "Ask a follow-up for size, color, or budget"
      });
    },
    premiumWelcome(config) {
      return createCard({
        kind: "teviq-card-welcome",
        kicker: "Support",
        title: "How can I help?",
        badge: "Online",
        badgeTone: "success",
        body: "I can help with orders, returns, warranty, and product questions."
      });
    },
    error(message) {
      const body = typeof message === "string" ? message : message?.reply;
      return createCard({
        kind: "teviq-card-error",
        kicker: "Connection issue",
        title: "Could not connect",
        badge: "Retry",
        badgeTone: "warning",
        body: body || "Could not connect. Please try again."
      });
    }
  };

  function getPresentationCards(data, originalMessage) {
    const intent = data?.intent || data?.card?.type || data?.type;
    const orderId = data?.order?.orderId || extractOrderId(originalMessage) || extractOrderId(data?.reply);
    const context = { orderId };
    const cardTypeMap = {
      order_status: "orderStatus",
      shipping_timeline: "shippingTimeline",
      return_eligibility: "returnEligibility",
      return_rejected: "returnRejected",
      refund_status: "refundStatus",
      human_support: "humanSupport",
      lead_capture: "leadCapture",
      product_recommendation: "productRecommendation",
      error: "error"
    };

    if (Array.isArray(data?.cards)) {
      const cards = data.cards
        .map((card) => cardTypeMap[card.type] || card.type)
        .filter((type) => supportCards[type])
        .map((type) => supportCards[type]({ ...data, card }, context));
      if (cards.length) return cards;
    }

    if (data?.card?.type) {
      const normalizedType = cardTypeMap[data.card.type] || data.card.type;
      if (supportCards[normalizedType]) return [supportCards[normalizedType](data, context)];
    }

    if (intent === "order_tracking") {
      const cards = [supportCards.orderStatus(data, context)];
      if (extractStatus(data.reply) || data?.order?.status) cards.push(supportCards.shippingTimeline(data, context));
      return cards;
    }

    if (intent === "return_exchange") {
      return [
        isReturnRejected(data.reply)
          ? supportCards.returnRejected(data, context)
          : supportCards.returnEligibility(data, context)
      ];
    }

    if (intent === "refund_status") return [supportCards.refundStatus(data, context)];
    if (intent === "human_support" || intent === "complaint" || intent === "escalation" || data?.escalated) {
      return [supportCards.humanSupport(data, context)];
    }
    if (intent === "lead_capture" || intent === "business_enquiry") return [supportCards.leadCapture(data, context)];
    if (intent === "product_recommendation" || intent === "size_help") {
      return [supportCards.productRecommendation(data, context)];
    }

    return [];
  }

  function renderResponseIntoBubble(bubble, data, originalMessage) {
    const cards = getPresentationCards(data, originalMessage);
    if (!cards.length) {
      bubble.textContent = data.reply || "Sorry, I could not understand that.";
      return;
    }

    const row = bubble.parentElement;
    if (row) row.classList.add("teviq-card-row");
    bubble.className = "teviq-chat-message bot teviq-card-host";
    bubble.innerHTML = "";
    const stack = createElement("div", "teviq-card-stack");
    cards.forEach((card) => stack.appendChild(card));
    bubble.appendChild(stack);
  }

  function renderErrorIntoBubble(bubble, message) {
    const row = bubble.parentElement;
    if (row) row.classList.add("teviq-card-row");
    bubble.className = "teviq-chat-message bot teviq-card-host";
    bubble.innerHTML = "";
    const stack = createElement("div", "teviq-card-stack");
    stack.appendChild(supportCards.error(message));
    bubble.appendChild(stack);
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

  function setBusy(input, send, quickReplyContainers, isBusy) {
    input.disabled = isBusy;
    send.disabled = isBusy;
    input.setAttribute("aria-busy", String(isBusy));
    send.classList.toggle("is-loading", isBusy);
    const containers = Array.isArray(quickReplyContainers)
      ? quickReplyContainers
      : [quickReplyContainers];
    containers.filter(Boolean).forEach((container) => {
      container.querySelectorAll("button").forEach((button) => {
        button.disabled = isBusy;
      });
    });
  }

  function pulseSendSuccess(send) {
    send.classList.remove("is-sent");
    window.requestAnimationFrame(() => {
      send.classList.add("is-sent");
      window.setTimeout(() => send.classList.remove("is-sent"), 380);
    });
  }

  function createAction(label, message) {
    return { label, message: message || label };
  }

  function normalizeAction(action) {
    if (typeof action === "string") return createAction(action, action);
    return createAction(action?.label || action?.message || "", action?.message || action?.label || "");
  }

  function getBrandCategory(config) {
    const value = `${brandId} ${config?.brandName || ""} ${config?.widgetTitle || ""}`.toLowerCase();
    if (value.includes("beauty") || value.includes("skin")) return "beauty";
    if (value.includes("urban") || value.includes("gadget") || value.includes("electronic")) return "electronics";
    if (value.includes("vastra") || value.includes("fashion") || value.includes("apparel")) return "fashion";
    return "general";
  }

  function getDefaultActions() {
    return [
      createAction("📦 Track my order", "Track my order"),
      createAction("↩ Return / Exchange", "Return / Exchange"),
      createAction("🚚 Shipping & Delivery", "Shipping & Delivery"),
      createAction("👤 Talk to Support", "Talk to human")
    ];
  }

  function getCategoryActions(category) {
    if (category === "fashion") {
      return [
        createAction("📏 Size Guide", "Size guide"),
        createAction("👕 Exchange Size", "Exchange size")
      ];
    }
    if (category === "electronics") {
      return [
        createAction("🛡 Warranty", "Warranty help"),
        createAction("🔧 Product Help", "Product help")
      ];
    }
    if (category === "beauty") {
      return [
        createAction("🌿 Ingredients", "Ingredients"),
        createAction("✨ Product Usage", "Product usage")
      ];
    }
    return [];
  }

  function uniqueActions(actions) {
    const seen = new Set();
    return actions.filter((action) => {
      const key = action.message.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getSuggestedActions(context) {
    const category = context?.category || "general";
    const intent = context?.intent || "default";
    const categoryActions = getCategoryActions(category);
    let actions;

    if (intent === "order_tracking") {
      actions = [
        createAction("↩ Return Item", "Return Item"),
        createAction("🚚 Shipping Updates", "Shipping Updates"),
        createAction("📦 Track Another Order", "Track another order"),
        createAction("👤 Talk to Support", "Talk to human")
      ];
    } else if (intent === "return_exchange") {
      actions = [
        createAction("💳 Refund Status", "Refund status"),
        createAction("🔄 Exchange Item", "Exchange Item"),
        createAction("📦 Track Order", "Track my order"),
        createAction("👤 Talk to Support", "Talk to human")
      ];
    } else {
      actions = [
        ...getDefaultActions().slice(0, 2),
        ...categoryActions,
        createAction("👤 Talk to Support", "Talk to human")
      ];
    }

    const talk = createAction("👤 Talk to Support", "Talk to human");
    const withoutTalk = uniqueActions(actions).filter(
      (action) => action.message.toLowerCase() !== talk.message.toLowerCase()
    );
    return uniqueActions([...withoutTalk.slice(0, 3), talk]);
  }

  function renderQuickReplies(container, replies, submitMessage) {
    container.innerHTML = "";

    replies.slice(0, 4).map(normalizeAction).forEach((action) => {
      const chip = createElement("button", "teviq-quick-reply");
      const label = createElement("span", "", action.label);
      chip.type = "button";
      chip.dataset.teviqReply = action.message;
      chip.setAttribute("aria-label", `Send quick reply: ${action.label}`);
      chip.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        submitMessage(action.message);
      });
      chip.appendChild(label);
      container.appendChild(chip);
    });
  }

  function renderCompactSuggestions(container, replies, submitMessage) {
    const list = container.querySelector(".teviq-suggestion-list");
    if (!list) return;
    list.innerHTML = "";

    replies.slice(0, 4).map(normalizeAction).forEach((action) => {
      const chip = createElement(
        "button",
        "teviq-suggestion-chip",
        action.label
      );
      chip.type = "button";
      chip.dataset.teviqReply = action.message;
      chip.setAttribute("aria-label", `Send suggested action: ${action.label}`);
      chip.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        submitMessage(action.message);
      });
      list.appendChild(chip);
    });
  }

  function renderWelcome(messages, config, actions, submitMessage) {
    const card = supportCards.premiumWelcome(config);
    const quickReplies = createElement("div", "teviq-quick-replies");
    const inner = card.querySelector(".teviq-card-inner");
    if (inner) inner.appendChild(quickReplies);
    messages.appendChild(card);
    renderQuickReplies(quickReplies, actions, submitMessage);
    return quickReplies;
  }

  async function mountWidget() {
    injectStyles();
    const config = await fetchBrandConfig();
    const brandCategory = getBrandCategory(config);
    const defaultActions = getDefaultActions();
    const positionClass =
      config.position === "bottom-left"
        ? "teviq-position-bottom-left"
        : "teviq-position-bottom-right";

    const button = createElement(
      "button",
      `teviq-chat-button ${positionClass}`,
      "T"
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

    const close = createElement("button", "teviq-chat-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close support chat");
    close.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    header.append(brandWrap, close);

    const messages = createElement("div", "teviq-chat-messages");

    const powered = createElement("div", "teviq-powered");
    powered.innerHTML = "<span>Powered by</span><strong>teviq.in</strong>";

    const form = createElement("form", "teviq-chat-form");
    const compactSuggestions = createElement("div", "teviq-suggestions");
    const compactLabel = createElement(
      "div",
      "teviq-suggestions-label",
      "Suggested actions"
    );
    const compactList = createElement("div", "teviq-suggestion-list");
    compactSuggestions.append(compactLabel, compactList);
    const composerRow = createElement("div", "teviq-composer-row");
    const input = createElement("input", "teviq-chat-input");
    input.type = "text";
    input.placeholder = "Ask about orders, returns, size...";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Type your support message");
    const send = createElement("button", "teviq-chat-send");
    send.type = "submit";
    send.setAttribute("aria-label", "Send message");
    send.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.5 10h10.2M10.8 5.8l4.2 4.2-4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    composerRow.append(input, send);
    form.append(compactSuggestions, composerRow, powered);

    windowEl.append(header, messages, form);
    document.body.append(windowEl, button);

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    let bodyLockState = null;

    function isMobilePanel() {
      return mobileQuery.matches;
    }

    function updateViewportHeight() {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--teviq-vh", `${viewportHeight}px`);
    }

    function lockBodyScroll() {
      if (!isMobilePanel() || bodyLockState) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      bodyLockState = {
        scrollY,
        htmlOverflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        bodyWidth: document.body.style.width
      };

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    function unlockBodyScroll() {
      if (!bodyLockState) return;

      const { scrollY, htmlOverflow, bodyOverflow, bodyPosition, bodyTop, bodyWidth } =
        bodyLockState;
      bodyLockState = null;

      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.body.style.position = bodyPosition;
      document.body.style.top = bodyTop;
      document.body.style.width = bodyWidth;
      window.scrollTo(0, scrollY);
    }

    function syncMobileLayout() {
      updateViewportHeight();
      if (windowEl.classList.contains("is-open") && isMobilePanel()) {
        windowEl.classList.add("teviq-mobile-open");
        lockBodyScroll();
        window.requestAnimationFrame(() => scrollToBottom(messages));
      } else {
        windowEl.classList.remove("teviq-mobile-open");
        unlockBodyScroll();
      }
    }

    function openWidget() {
      updateViewportHeight();
      windowEl.classList.add("is-open");
      syncMobileLayout();
      button.setAttribute("aria-label", `Close ${config.brandName} support chat`);
      window.setTimeout(() => {
        if (!isMobilePanel()) input.focus();
        scrollToBottom(messages);
      }, 180);
    }

    function closeWidget() {
      windowEl.classList.remove("is-open");
      windowEl.classList.remove("teviq-mobile-open");
      unlockBodyScroll();
      button.setAttribute("aria-label", `Open ${config.brandName} support chat`);
    }

    function activateCompactSuggestions() {
      if (!compactSuggestions.classList.contains("is-visible")) {
        compactSuggestions.classList.add("is-visible");
      }
      if (quickReplies) quickReplies.classList.add("is-archived");
    }

    function updateCompactSuggestions(intent) {
      const actions = getSuggestedActions({ category: brandCategory, intent });
      compactSuggestions.classList.add("is-refreshing");
      renderCompactSuggestions(compactSuggestions, actions, submitMessage);
      window.setTimeout(() => {
        compactSuggestions.classList.remove("is-refreshing");
      }, 220);
    }

    async function submitMessage(text) {
      const cleanText = text.trim();
      if (!cleanText || send.disabled) return;

      activateCompactSuggestions();
      appendMessage(messages, "user", cleanText);
      input.value = "";
      setBusy(input, send, [quickReplies, compactSuggestions], true);
      const pending = appendTyping(messages);

      try {
        const data = await sendMessage(cleanText);
        renderResponseIntoBubble(pending, data, cleanText);
        updateCompactSuggestions(data.intent);
        pulseSendSuccess(send);
      } catch (error) {
        renderErrorIntoBubble(pending, "Could not connect. Please try again.");
      } finally {
        scrollToBottom(messages);
        setBusy(input, send, [quickReplies, compactSuggestions], false);
        input.focus();
      }
    }

    const quickReplies = renderWelcome(messages, config, defaultActions, submitMessage);
    renderCompactSuggestions(compactSuggestions, defaultActions, submitMessage);

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

    windowEl.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-teviq-reply]");
      if (!chip || !windowEl.contains(chip)) return;
      event.preventDefault();
      submitMessage(chip.dataset.teviqReply || chip.textContent || "");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && windowEl.classList.contains("is-open")) {
        closeWidget();
      }
    });

    window.addEventListener("resize", syncMobileLayout);
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncMobileLayout);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(syncMobileLayout);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncMobileLayout);
      window.visualViewport.addEventListener("scroll", syncMobileLayout);
    }
    updateViewportHeight();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
})();
