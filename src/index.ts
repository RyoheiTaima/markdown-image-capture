import { Page } from "playwright";

import { readJsonWithDefault } from "./readJson";
import { readImageMark } from "./readImageMark";
import { validateJson } from "./validateJson";
import { getPagePool } from "./manageBrowser";
import { command } from "./parseCommand";
import { Page as PageConfig, Outline } from "./types";

const main = async () => {
  const { markdownPath, configPath } = command;

  const [imageParams, config] = await Promise.all([
    getImageParams(markdownPath),
    getConfig(configPath),
  ]);
  const pagePool = await getPagePool(config.browserType);

  if (config.login) {
    const page = await pagePool.acquire();
    await gotoPageAndActions(page, config.login);
    await pagePool.release(page);
  }

  await Promise.all(
    imageParams.map(async (ip) => {
      const page = await pagePool.acquire();
      await gotoPageAndActions(page, config.pages[ip.pageName]);
      await captureImageWithHighlight(
        page,
        ip.selector,
        ip.savePath,
        config.style.outline
      );
      await pagePool.release(page);
    })
  );
  await pagePool.close();
};

const getImageParams = async (path: string) => {
  return readImageMark(path);
};

const getConfig = async (path: string) => {
  const json = await readJsonWithDefault(path);
  return validateJson(json);
};

const gotoPageAndActions = async (page: Page, pageConfig: PageConfig) => {
  await page.goto(pageConfig.url);
  await page.waitForURL(pageConfig.url, { waitUntil: "networkidle" });

  for (const action of pageConfig.actions) {
    switch (action.type) {
      case "click":
        await page.click(action.selector);
        break;
      case "fill":
        await page.fill(action.selector, action.value || "");
        break;
      case "wait":
        await page.waitForSelector(action.selector, { state: action.value });
        break;
    }
  }
};

const captureImageWithHighlight = async (
  page: Page,
  selector: string | undefined,
  savePath: string,
  outlineStyle: Outline
) => {
  if (selector) {
    const locator = page.locator(selector);
    await locator.evaluate(
      (el, os) => (el.style.outline = `${os.width} ${os.style} ${os.color}`),
      outlineStyle
    );
  }
  await page.screenshot({ path: savePath });
};

console.info(`[INFO] ${new Date().toISOString()} Start to capture.`);
main().then(() =>
  console.info(`[INFO] ${new Date().toISOString()} Finish to capture.`)
);
