import { Page } from "playwright";

import { getPagePool } from ".";

const race = <T>(asyncFunc: () => Promise<T>, timeout: number) => {
  const timer = (t: number) => {
    return new Promise((_, reject) => setTimeout(reject, t));
  };
  return Promise.race([asyncFunc(), timer(timeout)]);
};

test("getPagePool should return pagePool with the number of pages specified by num_pages", async () => {
  const num_pages = 1;
  const pool = await getPagePool("chromium", num_pages);

  const page: Page = await pool.acquire(); // 1. occupy a page in pool

  expect(
    race(async () => {
      const page = await pool.acquire(); // 4. resolve this after releasing the page
      await pool.release(page); // 5. release all pages (if the page has been occupied, this test is timeout)
    }, 1000)
  ).rejects; // 2. timed out due to all pages occupied

  pool.release(page); // 3. return the page to pool
  await pool.close();
});

test("getPagePool should throw RangeError when specified invalid num_pages", async () => {
  await expect(getPagePool("chromium", 0)).rejects.toThrow(
    "The value 0 is out of the valid 'num_pages' range. 'num_pages' should be greater than one."
  );
  await expect(getPagePool("chromium", -1)).rejects.toThrow(
    "The value -1 is out of the valid 'num_pages' range. 'num_pages' should be greater than one."
  );
});
