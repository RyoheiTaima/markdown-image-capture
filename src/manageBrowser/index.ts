import genericPool, { Factory, Options, Pool } from "generic-pool";

import {
  chromium,
  firefox,
  webkit,
  Page,
  BrowserContext,
  Browser,
} from "playwright";
import { BrowserType } from "src/types";

class PagePool {
  context: BrowserContext;
  pool: Pool<Page>;

  constructor(context: BrowserContext, factory: Factory<Page>, opt: Options) {
    this.context = context;
    this.pool = genericPool.createPool(factory, opt);
  }

  public async acquire() {
    return this.pool.acquire();
  }

  public async release(page: Page) {
    await this.pool.release(page);
  }

  public async close() {
    await this.pool.drain();
    await Promise.all([this.pool.clear(), this.context.browser()?.close()]);
  }
}

export const getPagePool = async (
  browserType: BrowserType,
  num_pages: number = 4
) => {
  if (num_pages <= 0) {
    throw new RangeError(
      `The value ${num_pages} is out of the valid 'num_pages' range. 'num_pages' should be greater than one.`
    );
  }

  const context = await getBrowser(browserType);
  const factory = {
    create: () => {
      return context.newPage();
    },
    destroy: (page: Page) => {
      return page.close();
    },
  };
  const pool = new PagePool(context, factory, { max: num_pages });
  return pool;
};

const getBrowser = async (browserType: BrowserType) => {
  let browser: Browser;
  switch (browserType) {
    case "chromium":
      browser = await chromium.launch();
      break;
    case "firefox":
      browser = await firefox.launch();
      break;
    case "webkit":
      browser = await webkit.launch();
      break;
  }
  return browser.newContext({
    locale: "ja-JP",
    viewport: { width: 1920, height: 1080 },
  });
};
