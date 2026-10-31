// Font loading for the jynxt website

export const FONTS = {
  system: `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`,
  title: `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`,
  body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
};

/**
 * Load a system font by setting CSS custom properties
 */
export function loadFont(font = "system") {
  const fontStack = FONTS[font] || FONTS.system;
  document.documentElement.style.setProperty("--font", `"${fontStack}"`);
}

/**
 * Apply font to a specific element
 */
export function applyFont(element, font = "system") {
  const fontStack = FONTS[font] || FONTS.system;
  element.style.fontFamily = fontStack;
}