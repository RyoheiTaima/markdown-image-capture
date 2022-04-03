import { readImageMark } from ".";

let s = "";

jest.mock("fs", () => {
  return {
    promises: {
      readFile: jest.fn((_path, _opt) => s),
    },
  };
});

test("readImageMark should return ImageParams from valid image marks", async () => {
  s = `
  # single
  ![sample1_/html/body/div[5]/div/main/div[2]](sample1.png)
  
  # multi
  ![sample2_/html/body/div[5]/div/main/div[2]](sample2.png)![sample3_/html/body/div[5]/div/main/div[2]](sample3.png)
  
  # between words
  hoge[]![sample4_/html/body/div[5]/div/main/div[2]](sample4.png)huga!

  # no 'selector'
  ![sample5](sample5.png)
  `;

  const imageParams = await readImageMark("");

  expect(imageParams[0]).toEqual({
    pageName: "sample1",
    selector: "/html/body/div[5]/div/main/div[2]",
    savePath: "sample1.png",
  });
  expect(imageParams[1]).toEqual({
    pageName: "sample2",
    selector: "/html/body/div[5]/div/main/div[2]",
    savePath: "sample2.png",
  });
  expect(imageParams[2]).toEqual({
    pageName: "sample3",
    selector: "/html/body/div[5]/div/main/div[2]",
    savePath: "sample3.png",
  });
  expect(imageParams[3]).toEqual({
    pageName: "sample4",
    selector: "/html/body/div[5]/div/main/div[2]",
    savePath: "sample4.png",
  });
  expect(imageParams[4]).toEqual({
    pageName: "sample5",
    savePath: "sample5.png",
  });
});
