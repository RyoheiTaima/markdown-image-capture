import { readJsonWithDefault } from ".";

let s = "";

jest.mock("fs", () => {
  return {
    promises: {
      readFile: jest.fn((_path, _opt) => s),
    },
  };
});

test("readJsonWithDefault should return the json with default value", async () => {
  s = `{"name": "sample"}`;

  const json = await readJsonWithDefault("");

  expect(json).toEqual({
    name: "sample",
    browserType: "chromium",
    style: {
      outline: {
        color: "#FF0000",
        style: "solid",
        width: "3px",
      },
    },
  });
});

test("readJsonWithDefault should return the json overrided with default value overwritten", async () => {
  s = `{"browserType": "webkit", "style": {"outline": {"color": "#FFFFFF", "style": "solid", "width": "3px"}}}`;

  const json = await readJsonWithDefault("");

  expect(json).toEqual({
    browserType: "webkit",
    style: {
      outline: {
        color: "#FFFFFF",
        style: "solid",
        width: "3px",
      },
    },
  });
});
