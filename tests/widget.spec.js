const { expect, test } = require("@playwright/test");

async function openWidget(page) {
  const launcher = page.locator(".teviq-chat-button");
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(page.locator(".teviq-chat-window")).toHaveClass(/is-open/);
}

async function waitForCompletedReply(page, expectedText) {
  await expect(
    page
      .locator(".teviq-chat-messages")
      .getByText(expectedText, { exact: false })
      .last()
  ).toBeVisible();
  await expect(page.locator(".teviq-chat-send")).toBeEnabled();
}

test("suggestions remain functional through a complete conversation", async ({
  page
}) => {
  await page.goto("/");
  await openWidget(page);

  const welcomeSuggestions = page.locator(".teviq-quick-reply");
  await expect(welcomeSuggestions).toHaveCount(4);
  await expect(welcomeSuggestions.nth(0)).toContainText("Track my order");
  await expect(welcomeSuggestions.nth(1)).toContainText("Return / Exchange");
  await expect(welcomeSuggestions.nth(2)).toContainText("Shipping & Delivery");
  await expect(welcomeSuggestions.nth(3)).toContainText("Talk to Support");

  await welcomeSuggestions.nth(0).click();
  await waitForCompletedReply(page, "share your order ID");
  await expect(
    page.locator(".teviq-chat-message-row.user").last()
  ).toContainText("Track my order");

  const compactSuggestions = page.locator(".teviq-suggestions");
  await expect(compactSuggestions).toHaveClass(/is-visible/);
  await expect(page.locator(".teviq-suggestion-chip")).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: /Return Item/i })
  ).toBeEnabled();

  await page.getByRole("button", { name: /Return Item/i }).click();
  await waitForCompletedReply(page, "return or exchange eligibility");
  await expect(
    page.getByRole("button", { name: /Refund Status/i })
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Talk to Support/i }).last()
  ).toBeEnabled();

  await page
    .getByRole("button", { name: /Talk to Support/i })
    .last()
    .click();
  await waitForCompletedReply(page, "Please share your name");
  await expect(page.locator(".teviq-lead-form")).toBeVisible();

  const input = page.locator(".teviq-chat-input");
  await input.fill("How long does delivery take?");
  await input.press("Enter");
  await waitForCompletedReply(page, "three to five business days");
  await expect(compactSuggestions).toHaveClass(/is-visible/);
  await expect(page.locator(".teviq-suggestion-chip")).toHaveCount(4);

  const messageCount = await page
    .locator(".teviq-chat-message-row.user")
    .count();
  await page.getByRole("button", { name: "Close support chat" }).click();
  await expect(page.locator(".teviq-chat-window")).not.toHaveClass(/is-open/);
  await page.locator(".teviq-chat-button").click();
  await expect(page.locator(".teviq-chat-window")).toHaveClass(/is-open/);
  await expect(page.locator(".teviq-chat-message-row.user")).toHaveCount(
    messageCount
  );
  await expect(compactSuggestions).toHaveClass(/is-visible/);

  await page.getByRole("button", { name: /Track my order/i }).last().click();
  await waitForCompletedReply(page, "share your order ID");
});

test("mobile panel fills the viewport and restores page scrolling", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openWidget(page);

  const panel = page.locator(".teviq-chat-window");
  await expect(panel).toHaveClass(/teviq-mobile-open/);
  await page.waitForTimeout(400);
  const box = await panel.boundingBox();

  expect(box.x).toBeLessThanOrEqual(1);
  expect(box.y).toBeLessThanOrEqual(1);
  expect(box.width).toBeGreaterThanOrEqual(389);
  expect(box.height).toBeGreaterThanOrEqual(843);
  await expect(page.getByRole("button", { name: "Close support chat" })).toBeVisible();
  await expect(page.locator(".teviq-chat-input")).toBeVisible();
  await expect(page.locator(".teviq-chat-header")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.position))
    .toBe("fixed");

  await page.getByRole("button", { name: "Close support chat" }).click();
  await expect
    .poll(() => page.evaluate(() => document.body.style.position))
    .toBe("");
});
