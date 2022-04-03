import genericPool, { Options, Pool } from "generic-pool";

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

  constructor(context: BrowserContext, opt: Options) {
    const factory = {
      create: () => {
        return context.newPage();
      },
      destroy: (page: Page) => {
        return page.close();
      },
    };

    this.context = context;
    this.pool = genericPool.createPool(factory, opt);
  }

  public acquire = async () => await this.pool.acquire();
  public release = async (page: Page) => {
    await this.pool.release(page);
  };
  public close = async () => {
    await this.pool.drain();
    await Promise.all([this.pool.clear(), this.context.browser()?.close()]);
  };
}

export const getPagePool = async (browserType: BrowserType, num_pages = 4) => {
  if (num_pages <= 0) {
    throw new RangeError(
      `The value ${num_pages} is out of the valid 'num_pages' range. 'num_pages' should be greater than one.`
    );
  }

  const context = await getBrowser(browserType);
  const pool = new PagePool(context, { max: num_pages });
  return pool;
};

const getBrowser = async (browserType: BrowserType) => {
  let browser: Browser;
  switch (browserType) {
    case "chromium":
      browser = await chromium.launch();
      console.log(JSON.stringify(browser));
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
